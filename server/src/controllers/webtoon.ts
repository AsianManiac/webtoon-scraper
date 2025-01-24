export interface ChapterInfo {
  title: string;
  chapterNumber: number;
  chapterImage?: string;
  dataEpisodeNo: number;
  contentUrl: string;
}

export interface DownloadRequest {
  url?: string;
  webtoonIds: number[];
  webtoonId: number;
  startChapter?: number;
  endChapter?: number;
  dest?: string;
  imagesFormat?: "jpg" | "png";
  downloadLatestChapter?: boolean;
  allChapters?: boolean;
  separateChapters?: boolean;
}

export interface DownloadProgress {
  type?: string;
  downloadId: string;
  toonTitle?: string;
  chapter?: number;
  totalImages?: number;
  downloadedImages?: number;
  status?: DownloadStatusEnum;
  message?: string;
}

import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import type { DownloadStatusEnum } from "../utils/enums";
import { db } from "../utils/prisma";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36";

const headers = {
  dnt: "1",
  "user-agent": USER_AGENT,
  "accept-language": "en-US,en;q=0.9",
};

const imageHeaders = {
  referer: "https://www.webtoons.com/",
  ...headers,
};

/**
 * Slugifies a title to create a URL-friendly folder name.
 */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove duplicate hyphens
}

/**
 * Ensures the folder exists, creating it if necessary.
 */
export async function ensureFolder(folderPath: string): Promise<void> {
  try {
    await fs.mkdir(folderPath, { recursive: true });
    console.log(`Folder ensured: ${folderPath}`);
  } catch (error) {
    console.error(`Error creating folder ${folderPath}:`, error);
    throw error;
  }
}

/**
 * Validates that all images for a chapter exist and are valid.
 */
export async function validateChapterImages(
  chapterPath: string,
  totalImages: number
): Promise<boolean> {
  try {
    ensureFolder(chapterPath);
    const files = await fs.readdir(chapterPath);
    if (files.length !== totalImages) return false;

    for (const file of files) {
      const filePath = path.join(chapterPath, `${file}.jpg`);
      const image = sharp(filePath);
      await image.metadata(); // Check if the file is a valid image
    }
    return true;
  } catch (error) {
    console.error(`Error validating images in ${chapterPath}:`, error);
    return false;
  }
}

export async function getSeriesTitle(html: string): Promise<string> {
  const $ = cheerio.load(html);
  const title = $('meta[property="og:title"]').attr("content");
  return title ? title.trim() : "";
}

export async function getChapterViewerUrl(html: string): Promise<string> {
  const $ = cheerio.load(html);
  const url = $("li[data-episode-no]").first().find("a").attr("href");
  return url?.split("&")[0] || "";
}

export async function getFirstChapterEpisodeNo(
  seriesUrl: string
): Promise<number> {
  try {
    const { data } = await axios.get(seriesUrl, { headers });
    const $ = cheerio.load(data);
    const href = $("#_btnEpisode").attr("href");
    if (href) {
      const match = href.match(/episode_no=(\d+)/);
      if (match) return Number.parseInt(match[1]);
    }

    // Fallback to getting first episode from list
    const { data: lastPageData } = await axios.get(`${seriesUrl}&page=9999`, {
      headers,
    });
    const $lastPage = cheerio.load(lastPageData);
    const episodes = $lastPage("li._episodeItem")
      .map((_, el) => Number.parseInt($(el).attr("data-episode-no") || "0"))
      .get();
    return Math.min(...episodes);
  } catch (error) {
    console.error("Error getting first chapter:", error);
    throw error;
  }
}

export async function getChaptersDetails(
  viewerUrl: string,
  seriesUrl: string,
  startChapter = 1,
  endChapter?: number,
  downloadLatestChapter?: boolean
): Promise<ChapterInfo[]> {
  const firstChapter = await getFirstChapterEpisodeNo(seriesUrl);
  const { data } = await axios.get(`${viewerUrl}&episode_no=${firstChapter}`, {
    headers,
  });
  const $ = cheerio.load(data);

  const chapters: ChapterInfo[] = $(".episode_cont li")
    .map((i, el) => ({
      title: $(el).find("span.subj").text(),
      chapterNumber: i + 1,
      dataEpisodeNo: Number.parseInt($(el).attr("data-episode-no") || "0"),
      contentUrl: $(el).find("a").attr("href") || "",
    }))
    .get();

  if (downloadLatestChapter) {
    const latestChapter = chapters[chapters.length - 1];
    latestChapter.chapterNumber = chapters.length; // Ensure it reflects the correct sequence number
    return [latestChapter];
  }

  const start = startChapter - 1;
  const end = endChapter ? endChapter : chapters.length;
  return chapters.slice(start, end);
}

export async function getImageUrls(
  viewerUrl: string,
  dataEpisodeNum: number
): Promise<string[]> {
  const { data } = await axios.get(
    `${viewerUrl}&episode_no=${dataEpisodeNum}`,
    { headers }
  );
  const $ = cheerio.load(data);
  return $(".viewer_img._img_viewer_area img")
    .map((_, el) => $(el).attr("data-url") || "")
    .get();
}

/**
 * Downloads a single image.
 */
async function downloadImage(
  url: string,
  dest: string,
  chapterNumber: number,
  pageNumber: number,
  format: "jpg" | "png" = "jpg"
): Promise<void> {
  try {
    const { data } = await axios.get(url, {
      headers: imageHeaders,
      responseType: "arraybuffer",
    });

    const fileName = `${String(chapterNumber).padStart(
      3,
      "0"
    )}_${pageNumber}.${format}`;
    const filePath = path.join(dest, fileName);

    const image = sharp(data);
    if (format === "png") {
      await image.png().toFile(filePath);
    } else {
      await image.jpeg().toFile(filePath);
    }

    console.log(`Downloaded image: ${filePath}`);
  } catch (error) {
    console.error(
      `Error downloading image (Chapter ${chapterNumber}, Page ${pageNumber}):`,
      error
    );
  }
}

/**
 * Downloads an entire chapter.
 */
export async function downloadChapter(
  viewerUrl: string,
  downloadId: string,
  chapterInfo: ChapterInfo,
  dest: string,
  format: "jpg" | "png" = "jpg",
  onProgress: (progress: DownloadProgress) => void
): Promise<void> {
  const imgUrls = await getImageUrls(viewerUrl, chapterInfo.dataEpisodeNo);
  await ensureFolder(dest);

  const chapterImagePath = path.join(
    dest,
    `coverImage${chapterInfo.chapterNumber}.jpg`
  );
  await downloadAndSaveImage(imgUrls[2], chapterImagePath);

  for (let i = 0; i < imgUrls.length; i++) {
    try {
      await downloadImage(
        imgUrls[i],
        dest,
        chapterInfo.chapterNumber,
        i + 1,
        format
      );

      onProgress({
        downloadId: "",
        chapter: chapterInfo.chapterNumber,
        totalImages: imgUrls.length,
        downloadedImages: i + 1,
      });
    } catch (error) {
      console.error(
        `Error processing image ${i + 1} in chapter ${
          chapterInfo.chapterNumber
        }:`,
        error
      );
    }
  }
  // Save the chapter image path to the database
  await db.downloadedChapter.update({
    where: {
      downloadId_chapterNumber: {
        downloadId,
        chapterNumber: chapterInfo.chapterNumber,
      },
    },
    data: { chapterImage: chapterImagePath },
  });
}

export async function downloadToonImages(
  webtoonUrl: string,
  dest: string,
  webtoonId: number
): Promise<void> {
  try {
    const { data } = await axios.get(webtoonUrl, { headers });
    const $ = cheerio.load(data);

    const coverImageUrl = $(".detail_body.banner")
      .css("background-image")
      ?.match(/url$$(.*?)$$/)?.[1];
    const heroImageUrl = $(".detail_bg")
      .css("background-image")
      ?.match(/url$$(.*?)$$/)?.[1];

    if (coverImageUrl) {
      const coverImagePath = path.join(dest, "toonImage", "coverImage.jpg");
      await downloadAndSaveImage(coverImageUrl, coverImagePath);
      await db.webtoon.update({
        where: { id: webtoonId },
        data: { coverImage: coverImagePath },
      });
    }

    if (heroImageUrl) {
      const heroImagePath = path.join(dest, "toonImage", "heroImage.jpg");
      await downloadAndSaveImage(heroImageUrl, heroImagePath);
      await db.webtoon.update({
        where: { id: webtoonId },
        data: { heroImage: heroImagePath },
      });
    }
  } catch (error) {
    console.error("Error downloading toon images:", error);
  }
}

async function downloadAndSaveImage(
  url: string,
  filePath: string
): Promise<void> {
  const { data } = await axios.get(url, {
    headers: imageHeaders,
    responseType: "arraybuffer",
  });

  await ensureFolder(path.dirname(filePath));
  await sharp(data).jpeg().toFile(filePath);
}
