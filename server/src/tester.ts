import { DownloadStatus, QueueStatus } from "@prisma/client";
import axios from "axios";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressWs from "express-ws";
import morgan from "morgan";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";
import config from "../config";
import type { DownloadProgress, DownloadRequest } from "./controllers/webtoon";
import {
  downloadChapter,
  ensureFolder,
  getChapterViewerUrl,
  getChaptersDetails,
  getSeriesTitle,
  slugifyTitle,
} from "./controllers/webtoon";
import router from "./routes/downloadedRoutes";
import { emailService } from "./services/emailService";
import { DownloadStatusEnum } from "./utils/enums";
import { db } from "./utils/prisma";

const app = express();
const wsInstance = expressWs(app);
const port = 8001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("common"));

app.use("/api/downloads", router);

const clients = new Map<string, WebSocket>();
const useDbQueue = config.USE_DB_QUEUE;

const activeDownloads = new Map<string, DownloadRequest>();
const downloadQueue: string[] = [];
let isProcessingQueue = false;

app.get("/toons", async (req, res) => {
  try {
    const toons = await db.webtoon.findMany({
      select: {
        id: true,
        title: true,
        url: true,
      },
      take: 20,
    });
    res.status(200).json(toons);
  } catch (error) {
    console.error("Error fetching toons:", error);
    res.status(500).json({ error: "Failed to fetch toons" });
  }
});
app.post("/download", async (req, res) => {
  try {
    const request: DownloadRequest = req.body;
    const downloads = [];

    for (const webtoonId of request.webtoonIds) {
      const existingDownload = await db.download.findFirst({
        where: { webtoonId, status: DownloadStatus.COMPLETED },
      });

      if (!existingDownload) {
        const downloadId = uuidv4();
        const download = await db.download.create({
          data: {
            downloadId,
            webtoonId,
            status: DownloadStatus.PENDING,
          },
        });
        downloads.push(download);

        if (useDbQueue) {
          await db.queue.create({
            data: {
              id: downloadId,
              type: "DOWNLOAD",
              payload: { ...request, webtoonId } as any,
              status: QueueStatus.PENDING,
            },
          });
        } else {
          processDownload(downloadId, { ...request, webtoonId });
        }
      } else {
        processDownload(existingDownload.downloadId, { ...request, webtoonId });
      }
    }

    res.json({ downloads });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to start download" });
  }
});

app.get("/status", (req, res) => {
  res.json({
    status: "in progress",
    message: "Welcome to Webtoon Downloader",
    version: "2.0",
  });
});

async function processQueue() {
  try {
    const queueItem = await db.queue.findFirst({
      where: { status: QueueStatus.PENDING, type: "DOWNLOAD" },
    });

    if (queueItem) {
      await db.queue.update({
        where: { id: queueItem.id },
        data: { status: QueueStatus.PROCESSING },
      });

      await processDownload(queueItem.id, queueItem.payload as any);

      await db.queue.update({
        where: { id: queueItem.id },
        data: { status: QueueStatus.COMPLETED },
      });
    }
  } catch (error) {
    console.error("Error processing queue:", error);
  }

  // Schedule next queue processing
  setTimeout(processQueue, 5000);
}

async function processDownload(downloadId: string, options: DownloadRequest) {
  try {
    await db.download.update({
      where: { downloadId },
      data: { status: DownloadStatus.IN_PROGRESS },
    });

    for (const webtoonId of options.webtoonIds) {
      const webtoon = await db.webtoon.findUnique({
        where: { id: webtoonId },
        include: { downloads: true },
      });
      if (!webtoon) {
        throw new Error(`Webtoon not found: ${webtoonId}`);
      }

      const { data: html } = await axios.get(webtoon.url);
      const viewerUrl = await getChapterViewerUrl(html);
      const seriesTitle = await getSeriesTitle(html);
      const slugifiedTitle = slugifyTitle(seriesTitle);
      const seriesFolder = path.join(
        options.dest || "downloads",
        slugifiedTitle
      );
      await ensureFolder(seriesFolder);

      const existingDownload = webtoon.downloads.find(
        (d) => d.status === DownloadStatus.COMPLETED
      );
      if (existingDownload && !options.downloadLatestChapter) {
        console.log(`Skipping download for completed webtoon: ${seriesTitle}`);
        return;
      }

      let startChapter = options.startChapter || 1;
      if (existingDownload) {
        const lastDownloadedChapter = await db.downloadedChapter.findFirst({
          where: { downloadId: existingDownload.downloadId },
          orderBy: { chapterNumber: "desc" },
        });
        if (lastDownloadedChapter) {
          startChapter = lastDownloadedChapter.chapterNumber + 1;
        }
      }

      const chapters = await getChaptersDetails(
        viewerUrl,
        webtoon.url,
        options.startChapter,
        options.endChapter,
        options.downloadLatestChapter
      );

      // Update totalChapters
      await db.download.update({
        where: { downloadId },
        data: { totalChapters: chapters.length },
      });

      for (const chapter of chapters) {
        const chapterFolder = options.separateChapters
          ? path.join(seriesFolder, `Chapter_${chapter.chapterNumber}`)
          : seriesFolder;

        await ensureFolder(chapterFolder);

        const existingChapter = await db.downloadedChapter.findUnique({
          where: {
            downloadId_chapterNumber: {
              downloadId,
              chapterNumber: chapter.chapterNumber,
            },
          },
        });

        if (
          existingChapter &&
          existingChapter.status === DownloadStatus.COMPLETED
        ) {
          console.log(
            `Skipping already downloaded chapter: ${chapter.chapterNumber}`
          );
          continue;
        }

        await downloadChapter(
          viewerUrl,
          downloadId,
          chapter,
          chapterFolder,
          options.imagesFormat || "jpg",
          async (progress) => {
            const update = {
              ...progress,
              downloadId,
              webtoonId,
              toonTitle: seriesTitle,
              status: DownloadStatusEnum.IN_PROGRESS,
            };
            notifyClients(downloadId, update);

            await db.downloadedChapter.upsert({
              where: {
                downloadId_chapterNumber: {
                  downloadId,
                  chapterNumber: chapter.chapterNumber,
                },
              },
              update: {
                totalImages: progress.totalImages || 0,
                downloadedImages: progress.downloadedImages || 0,
                sourcePath: chapterFolder,
                status: DownloadStatus.IN_PROGRESS,
              },
              create: {
                downloadId,
                chapterNumber: chapter.chapterNumber,
                totalImages: progress.totalImages || 0,
                downloadedImages: progress.downloadedImages || 0,
                sourcePath: chapterFolder,
                status: DownloadStatus.IN_PROGRESS,
              },
            });
          }
        );

        await db.download.update({
          where: { downloadId },
          data: { status: DownloadStatus.COMPLETED },
        });

        await db.downloadedChapter.update({
          where: {
            downloadId_chapterNumber: {
              downloadId,
              chapterNumber: chapter.chapterNumber,
            },
          },
          data: { status: DownloadStatus.COMPLETED },
        });
      }
    }

    await db.download.update({
      where: { downloadId },
      data: { status: DownloadStatus.COMPLETED },
    });

    notifyClients(downloadId, {
      downloadId,
      status: DownloadStatusEnum.COMPLETED,
    });
  } catch (error: any) {
    console.error(`Error downloading series:`, error);
    await db.download.update({
      where: { downloadId },
      data: { status: DownloadStatus.ERROR },
    });
    notifyClients(downloadId, {
      downloadId,
      status: DownloadStatusEnum.ERROR,
      message: `Error downloading series: ${error.message}`,
    });

    // Queue an email to notify the user about the error
    await emailService.queueEmail(
      process.env.ADMIN_EMAIL || "admin@example.com",
      "Download Error",
      `An error occurred while downloading webtoon(s) with ID(s): ${options.webtoonIds.join(
        ", "
      )}. Error: ${error.message}`
    );
  }
}

function notifyClients(download_id: string, progress: DownloadProgress) {
  for (const [clientId, ws] of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          download_id,
          ...progress,
        })
      );
    }
  }
}

wsInstance.app.ws("/ws", (ws, req) => {
  const clientId = uuidv4();
  clients.set(clientId, ws);

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.action === "start_download") {
        const downloadId = data.download_id;
        const request = activeDownloads.get(downloadId);

        if (!request) {
          ws.send(JSON.stringify({ error: "Invalid download_id" }));
          return;
        }

        try {
          await db.download.create({
            data: {
              downloadId,
              webtoonIds: request.webtoonIds,
              status: DownloadStatus.IN_PROGRESS, // Changed to IN_PROGRESS
            },
          });

          downloadQueue.push(downloadId);
          if (!isProcessingQueue) {
            processQueue();
          }
        } catch (error) {
          console.error("Download error:", error);
          ws.send(
            JSON.stringify({
              error: "Download failed",
              status: "error",
            })
          );
        }
      } else if (data.action === "pause_download") {
        const downloadId = data.download_id;
        const index = downloadQueue.indexOf(downloadId);
        if (index > -1) {
          downloadQueue.splice(index, 1);
        }
        await db.download.update({
          where: { downloadId },
          data: { status: DownloadStatus.PAUSED },
        });
        notifyClients(downloadId, {
          downloadId,
          status: DownloadStatusEnum.PAUSED,
        });
      } else if (data.action === "resume_download") {
        const downloadId = data.download_id;
        downloadQueue.push(downloadId);
        await db.download.update({
          where: { downloadId },
          data: { status: DownloadStatus.IN_PROGRESS },
        });
        if (!isProcessingQueue) {
          processQueue();
        }
        notifyClients(downloadId, {
          downloadId,
          status: DownloadStatusEnum.IN_PROGRESS,
        });
      }
    } catch (error) {
      console.error("WebSocket error:", error);
      ws.send(
        JSON.stringify({
          error: "Download failed",
          status: "error",
        })
      );
    }
  });

  ws.on("close", () => {
    clients.delete(clientId);
  });
});

// Start the queue processing if using database queue
if (useDbQueue) {
  processQueue();
}

// Start email queue processing
setInterval(() => {
  emailService.processEmailQueue();
}, 60000); // Process email queue every minute

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
