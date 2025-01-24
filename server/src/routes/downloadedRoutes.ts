import { DownloadStatus } from "@prisma/client";
import { Router, type Request, type Response } from "express";
import fs from "fs/promises";
import path from "path";
import { db } from "../utils/prisma";

const router = Router();

router.get("/failed", async (req: Request, res: Response) => {
  try {
    const failedDownloads = await db.download.findMany({
      where: { status: DownloadStatus.ERROR },
      include: {
        webtoon: true,
      },
      distinct: ["webtoonId"],
    });
    res.json(failedDownloads);
  } catch (error) {
    console.error("Error fetching failed downloads:", error);
    res.status(500).json({ error: "Failed to fetch failed downloads" });
  }
});

router.get("/in-progress", async (req: Request, res: Response) => {
  try {
    const inProgressDownloads = await db.download.findMany({
      where: {
        OR: [
          { status: DownloadStatus.IN_PROGRESS },
          { status: DownloadStatus.PAUSED },
        ],
      },
      include: {
        webtoon: true,
      },
      distinct: ["webtoonId"],
    });
    res.json(inProgressDownloads);
  } catch (error) {
    console.error("Error fetching in-progress downloads:", error);
    res.status(500).json({ error: "Failed to fetch in-progress downloads" });
  }
});

// router.get("/completed", async (req: Request, res: Response) => {
//   try {
//     const completedDownloads = await db.download.findMany({
//       where: { status: DownloadStatus.COMPLETED },
//       include: {
//         webtoon: true,
//       },
//       distinct: ["webtoonId"],
//     });
//     res.json(completedDownloads);
//   } catch (error) {
//     console.error("Error fetching completed downloads:", error);
//     res.status(500).json({ error: "Failed to fetch completed downloads" });
//   }
// });

router.get("/completed", async (req: Request, res: Response) => {
  try {
    const completedDownloads = await db.download.findMany({
      where: {
        status: DownloadStatus.COMPLETED,
        downloadChapters: {
          every: {
            status: DownloadStatus.COMPLETED,
            totalImages: {
              equals: db.downloadedChapter.fields.downloadedImages,
            },
          },
        },
      },
      include: {
        webtoon: true,
      },
      distinct: ["webtoonId"],
    });
    res.json(completedDownloads);
  } catch (error) {
    console.error("Error fetching completed downloads:", error);
    res.status(500).json({ error: "Failed to fetch completed downloads" });
  }
});

router.get("/toon/:id/chapters", async (req: Request, res: Response) => {
  try {
    const webtoonId = Number.parseInt(req.params.id);
    const chapters = await db.downloadedChapter.findMany({
      where: {
        download: {
          webtoonId: webtoonId,
        },
      },
      orderBy: {
        chapterNumber: "asc",
      },
      include: {
        download: {
          include: {
            webtoon: true,
          },
        },
      },
    });
    res.json(chapters);
  } catch (error) {
    console.error("Error fetching toon chapters:", error);
    res.status(500).json({ error: "Failed to fetch toon chapters" });
  }
});

router.get("/toons/:id", async (req: Request, res: Response) => {
  try {
    const webtoonId = Number.parseInt(req.params.id);
    const webtoon = await db.webtoon.findUnique({
      where: { id: webtoonId },
    });
    res.json(webtoon);
  } catch (error) {
    console.error("Error fetching toon chapters:", error);
    res.status(500).json({ error: "Failed to fetch toon chapters" });
  }
});

router.get("/downloaded-toons", async (req, res) => {
  try {
    const downloads = await db.download.findMany({
      where: {
        OR: [
          { status: DownloadStatus.COMPLETED },
          { status: DownloadStatus.IN_PROGRESS },
          { status: DownloadStatus.PAUSED },
        ],
      },
      include: {
        webtoon: true,
        downloadChapters: {
          orderBy: {
            chapterNumber: "asc",
          },
        },
      },
      distinct: ["webtoonId"],
    });

    res.json(downloads);
  } catch (error) {
    console.error("Error fetching downloaded toons:", error);
    res.status(500).json({ error: "Failed to fetch downloaded toons" });
  }
});

router.get(
  "/chapter-contents/:webtoonId/:chapterId",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const webtoonId = Number.parseInt(req.params.webtoonId);
      const chapterId = Number.parseInt(req.params.chapterId);

      const chapter = await db.downloadedChapter.findFirst({
        where: {
          id: chapterId,
          download: {
            webtoonId: webtoonId,
          },
        },
        include: {
          download: {
            include: {
              webtoon: true,
            },
          },
        },
      });

      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }

      const rootPath = path.join(process.cwd());
      const chapterPath = path.join(rootPath, chapter?.sourcePath!);
      const files = await fs.readdir(chapterPath);
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );

      // @ts-ignore
      function naturalSort(a, b) {
        const splitRegex = /(\d+)/;
        const aParts = a.split(splitRegex);
        const bParts = b.split(splitRegex);

        for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
          if (aParts[i] !== bParts[i]) {
            const aNum = parseInt(aParts[i], 10);
            const bNum = parseInt(bParts[i], 10);
            if (!isNaN(aNum) && !isNaN(bNum)) {
              return aNum - bNum;
            } else {
              return aParts[i].localeCompare(bParts[i]);
            }
          }
        }
        return aParts.length - bParts.length;
      }

      const sortedImageFiles = imageFiles.sort(naturalSort);

      const images = await Promise.all(
        sortedImageFiles.map(async (file) => {
          const filePath = path.join(chapterPath, file);
          const imageBuffer = await fs.readFile(filePath);
          console.log(filePath);
          return `data:image/${path
            .extname(file)
            .slice(1)};base64,${imageBuffer.toString("base64")}`;
        })
      );

      return res.json({
        chapterNumber: chapter?.chapterNumber,
        webtoonTitle: chapter?.download.webtoon?.title,
        images,
      });
    } catch (error) {
      console.error("Error fetching chapter contents:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch chapter contents" });
    }
  }
);

export default router;
