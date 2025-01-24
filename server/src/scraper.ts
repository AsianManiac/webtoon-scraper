import axios from "axios";
import * as cheerio from "cheerio";
import { differenceInDays } from "date-fns";
import fs from "fs/promises";
import cron from "node-cron";
import path from "path";
import type {
  Episode,
  SuggestedWebtoon,
  TrackingInfo,
  WebtoonData,
  WebtoonDetails,
} from "./types";
import { logger } from "./utils/logger";

const BASE_URL = "https://www.webtoons.com";
const ORIGINALS_URL = `${BASE_URL}/en/originals`;
const DATA_FOLDER = path.join(process.cwd(), "toons");

const FILES = {
  ONGOING: path.join(DATA_FOLDER, "ongoing_webtoons.json"),
  COMPLETED: path.join(DATA_FOLDER, "completed_webtoons.json"),
  ALL: path.join(DATA_FOLDER, "all_webtoons.json"),
  PROGRESS: path.join(DATA_FOLDER, "progress.json"),
  SCRAPED_IDS: path.join(DATA_FOLDER, "scraped_ids.json"),
  ONGOING_TRACKING: path.join(DATA_FOLDER, "ongoing_tracking.json"),
  COMPLETED_TRACKING: path.join(DATA_FOLDER, "completed_tracking.json"),
};

async function ensureFolderExists(folder: string): Promise<void> {
  try {
    await fs.mkdir(folder, { recursive: true });
  } catch (error) {
    logger.error(`Failed to create folder ${folder}`, error);
    throw error;
  }
}

async function loadJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function saveJsonFile(filePath: string, data: any): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function fetchPage(url: string): Promise<cheerio.Root> {
  try {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  } catch (error) {
    logger.error(`Error fetching page ${url}:`, error);
    throw error;
  }
}

async function scrapeOriginalsPage(): Promise<WebtoonData[]> {
  const $ = await fetchPage(ORIGINALS_URL);
  const webtoons: WebtoonData[] = [];

  $("#dailyList").each((_, section) => {
    const isOngoing = !$(section).hasClass("comp");
    $(section)
      .find("ul.daily_card li")
      .each((_, el) => {
        const $el = $(el);
        const $link = $el.find("a");
        webtoons.push({
          title: $el.find(".info .subj").text().trim(),
          url: $link.attr("href") || "",
          thumbnailUrl: $el.find("img").attr("src") || "",
          genre: $el.find(".genre").text().trim(),
          author: $el.find(".info .author").text().trim(),
          likes: $el.find(".grade_num").text().trim(),
          status: isOngoing ? "ONGOING" : "COMPLETED",
        });
      });
  });

  return webtoons;
}

async function scrapeEpisodes(url: string): Promise<Episode[]> {
  const episodes: Episode[] = [];
  let hasNextPage = true;
  let currentPageUrl = url;

  while (hasNextPage) {
    const $ = await fetchPage(currentPageUrl);

    $("#_listUl li").each((_, el) => {
      const $el = $(el);
      episodes.push({
        number: $el.find(".tx").text().trim(),
        title: $el.find(".subj span").text().trim(),
        uploadDate: $el.find(".date").text().trim(),
        thumbnailUrl: $el.find(".thmb img").attr("src") || "",
        url: $el.find("._episodeItem a").attr("href") || "",
        likes: $el.find(".like_area").text().trim().replace("like", ""),
      });
    });

    const $currentPage = $(".paginate span.on");
    const $nextPageLink = $currentPage.parent().next("a");

    if ($nextPageLink.length > 0) {
      const nextPageHref = $nextPageLink.attr("href");
      currentPageUrl = `https://webtoons.com${nextPageHref}`;
    } else {
      hasNextPage = false;
    }
  }

  return episodes;
}

async function scrapeWebtoonDetails(url: string): Promise<WebtoonDetails> {
  const $ = await fetchPage(url);

  const title = $(".detail_header .subj").text().trim();
  const author = $(".detail_header .author_area").text().trim();
  const authorProfile =
    $(".detail_header .author_area a.author").attr("href") || "";
  const genre = $(".detail_header .genre").text().trim();
  const rating = $(".detail_header .grade_num").text().trim();
  const description = $("#_asideDetail .summary").text().trim();
  const thumbnailUrl = $(".detail_header .thmb img").attr("src") || "";
  const status = $("#_asideDetail .day_info").text().includes("COMPLETED")
    ? "COMPLETED"
    : $("#_asideDetail .day_info").text().includes("HIATUS")
    ? "HIATUS"
    : "ONGOING";
  const releaseDays = $("#_asideDetail .day_info")
    .text()
    .trim()
    .split(",")
    .map((day) => day.trim());

  const views = $(".grade_area li:nth-child(1) .cnt").text().trim();
  const subscribers = $(".grade_area li:nth-child(2) .cnt").text().trim();

  const auth = $(".ly_creator_in h3:nth-child(1)").text().trim();
  const desc = $(".ly_creator_in p:nth-child(2)").text().trim();
  const writer = $(".ly_creator_in h3:nth-child(2)").text().trim();
  const andesc = $(".ly_creator_in p:nth-child(3)").text().trim();
  const anwriter = $(".ly_creator_in h3:nth-child(3)").text().trim();

  const episodes = await scrapeEpisodes(url);

  const suggestedWebtoons: SuggestedWebtoon[] = [];
  $(".detail_other .lst_type1 li").each((_, el) => {
    const $el = $(el);
    suggestedWebtoons.push({
      title: $el.find(".subj").text().trim(),
      url: $el.find("a").attr("href") || "",
      thumbnailUrl: $el.find("img").attr("src") || "",
      author: $el.find(".author").text().trim(),
      views: $el.find(".grade_num").text().trim(),
    });
  });

  return {
    title,
    url,
    author,
    authorDetail: {
      authorProfile,
      auth,
      desc,
      writer,
      andesc,
      anwriter,
    },
    genre,
    rating,
    description,
    thumbnailUrl,
    status,
    releaseDays,
    views,
    subscribers,
    episodes,
    suggestedWebtoons,
  };
}

async function updateTrackingInfo(
  webtoon: WebtoonDetails,
  isCompleted: boolean
): Promise<void> {
  const trackingFile = isCompleted
    ? FILES.COMPLETED_TRACKING
    : FILES.ONGOING_TRACKING;
  const tracking = await loadJsonFile<Record<string, TrackingInfo>>(
    trackingFile,
    {}
  );

  tracking[webtoon.url] = {
    lastEpisode: webtoon.episodes[0].number,
    lastUpdateDate: webtoon.episodes[0].uploadDate,
  };

  await saveJsonFile(trackingFile, tracking);
}

export async function scrapeAll(): Promise<void> {
  await ensureFolderExists(DATA_FOLDER);
  const scrapedIds = await loadJsonFile<string[]>(FILES.SCRAPED_IDS, []);
  const progress = await loadJsonFile<{ lastIndex: number }>(FILES.PROGRESS, {
    lastIndex: 0,
  });

  const ongoingWebtoons = await loadJsonFile<WebtoonData[]>(FILES.ONGOING, []);
  const completedWebtoons = await loadJsonFile<WebtoonData[]>(
    FILES.COMPLETED,
    []
  );
  const allWebtoons = await loadJsonFile<WebtoonDetails[]>(FILES.ALL, []);

  logger.info("Scraping originals page...");
  const webtoons = await scrapeOriginalsPage();
  logger.info(`Found ${webtoons.length} webtoons`);
  logger.info("Scraping individual webtoon details...");

  for (let i = progress.lastIndex; i < webtoons.length; i++) {
    const webtoon = webtoons[i];

    if (scrapedIds.includes(webtoon.url)) {
      const isCompleted = completedWebtoons.some((w) => w.url === webtoon.url);
      const trackingFile = isCompleted
        ? FILES.COMPLETED_TRACKING
        : FILES.ONGOING_TRACKING;
      const tracking = await loadJsonFile<Record<string, TrackingInfo>>(
        trackingFile,
        {}
      );

      if (tracking[webtoon.url]) {
        const lastUpdateDate = new Date(tracking[webtoon.url].lastUpdateDate);
        const daysSinceLastUpdate = differenceInDays(
          new Date(),
          lastUpdateDate
        );

        if (daysSinceLastUpdate < 7) {
          console.log(`Skipping recently updated: ${webtoon.title}`);
          continue;
        }
      }
    }

    console.log(
      `Scraping details for ${webtoon.title} (${i + 1}/${webtoons.length})`
    );
    const details = await scrapeWebtoonDetails(webtoon.url);

    await updateTrackingInfo(details, details.status === "COMPLETED");

    allWebtoons.push(details);
    if (details.status === "ONGOING") {
      ongoingWebtoons.push(webtoon);
    } else {
      completedWebtoons.push(webtoon);
    }

    scrapedIds.push(webtoon.url);
    await saveJsonFile(FILES.ALL, allWebtoons);
    await saveJsonFile(FILES.ONGOING, ongoingWebtoons);
    await saveJsonFile(FILES.COMPLETED, completedWebtoons);
    await saveJsonFile(FILES.SCRAPED_IDS, scrapedIds);

    progress.lastIndex = i + 1;
    await saveJsonFile(FILES.PROGRESS, progress);

    console.log(`Finished scraping: ${webtoon.title}`);
    await new Promise((resolve) => setTimeout(resolve, 50)); // Reduced delay for faster scraping
  }
}

export async function dailyUpdate(): Promise<void> {
  const ongoingTracking = await loadJsonFile<Record<string, TrackingInfo>>(
    FILES.ONGOING_TRACKING,
    {}
  );

  for (const [url, tracking] of Object.entries(ongoingTracking)) {
    console.log(`Checking for updates: ${url}`);
    const details = await scrapeWebtoonDetails(url);

    if (details.episodes[0].number !== tracking.lastEpisode) {
      console.log(`New episode found for: ${details.title}`);
      await updateTrackingInfo(details, false);
    }

    if (details.status === "COMPLETED") {
      console.log(`Webtoon completed: ${details.title}`);
      await updateTrackingInfo(details, true);
      delete ongoingTracking[url];
      await saveJsonFile(FILES.ONGOING_TRACKING, ongoingTracking);
    }

    await new Promise((resolve) => setTimeout(resolve, 50)); // Add a small delay between requests
  }
}

export function setupCronJob(): void {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily update...");
    await dailyUpdate();
    console.log("Daily update completed.");
  });
}
