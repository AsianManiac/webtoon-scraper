import { WebtoonStatus } from "@prisma/client";
import axios from "axios";
import * as cheerio from "cheerio";
import ProgressBar from "progress";
import { logger } from "../logger";
import type {
  Episode,
  SuggestedWebtoon,
  WebtoonData,
  WebtoonDetails,
} from "../types";
import {
  saveWebtoonToDatabase,
  updateWebtoonTrackingInfo,
} from "../utils/databaseOperations";

const BASE_URL = "https://www.webtoons.com";
const ORIGINALS_URL = `${BASE_URL}/en/originals`;

/**
 * Scrapes ongoing webtoons, saves them to the database, and updates tracking information.
 * Responds immediately and continues the scraping process in the background.
 * @param callback Function to execute on completion or failure.
 */
export async function scrapeOngoingToonsWithCallback(
  callback: (error?: Error) => void
): Promise<void> {
  try {
    logger.info("Starting the scraping process for ongoing webtoons...");

    // Fetch ongoing webtoons
    const webtoons = await scrapeOriginalsOngoingPage();
    const ongoingWebtoons = webtoons.filter((w) => w.status === "ONGOING");

    // Process each webtoon in the background
    for (const webtoon of ongoingWebtoons) {
      try {
        logger.info(`Processing webtoon: ${webtoon.title}`);

        const details = await scrapeWebtoonDetails(webtoon.url);
        await saveWebtoonToDatabase(details);
        await updateWebtoonTrackingInfo(details as any, false);

        logger.info(`Successfully processed: ${webtoon.title}`);
      } catch (error) {
        logger.error(`Error processing webtoon: ${webtoon.title}`, error);
      }
    }

    logger.info("Ongoing webtoons scraping completed successfully.");
    callback(); // Trigger the callback on success
  } catch (error: any) {
    logger.error("Failed to scrape ongoing webtoons.", error);
    callback(error); // Trigger the callback on failure
  }
}

/**
 * Scrapes the originals page for webtoon data
 * @returns {Promise<WebtoonData[]>} Array of webtoon data
 */
async function scrapeOriginalsPage(): Promise<WebtoonData[]> {
  const $ = await fetchPage(ORIGINALS_URL);
  const webtoons: WebtoonData[] = [];

  $("#dailyList .daily_lst, .daily_lst.comp").each((_, section) => {
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

/**
 * Scrapes the originals page for webtoon data.
 * @returns {Promise<WebtoonData[]>} Array of webtoon data.
 */
async function scrapeOriginalsOngoingPage(): Promise<WebtoonData[]> {
  const $ = await fetchPage(ORIGINALS_URL); // Replace with actual URL
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

  logger.info(`${webtoons.length} webtoons found on the originals page.`);
  return webtoons;
}

/**
 * Scrapes episodes for a given webtoon URL
 * @param {string} url - The URL of the webtoon
 * @returns {Promise<Episode[]>} Array of episodes
 */
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

/**
 * Scrapes details for a specific webtoon
 * @param {string} url - The URL of the webtoon
 * @param {ProgressBar} progressBar - Progress bar instance
 * @returns {Promise<WebtoonDetails>} Webtoon details
 */
async function scrapeWebtoonDetails(url: string): Promise<WebtoonDetails> {
  const $ = await fetchPage(url);

  const title = $(".detail_info .subj").text().trim();
  const author = $(".detail_info .author a").text().trim();
  const authorProfile = $(".detail_info .author a").attr("href") || "";
  const auth = $(".detail_info .author").text().trim();
  const desc = $(".detail_info .detail_desc").text().trim();
  const writer = $(".detail_info .writer").text().trim();
  const andesc = $(".detail_info .an_desc").text().trim();
  const anwriter = $(".detail_info .an_writer").text().trim();
  const genre = $(".detail_info .genre").text().trim();
  const rating = Number($(".detail_info .grade_num").text().trim());
  const description = $(".detail_info .detail_desc").text().trim();
  const thumbnailUrl = $(".detail_info img").attr("src") || "";
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
  const views = Number($(".detail_info .view").text().trim());
  const subscribers = Number($(".detail_info .sub").text().trim());
  const suggestedWebtoons: SuggestedWebtoon[] = [];

  $(".suggested_lst li").each((_, el) => {
    const $el = $(el);
    suggestedWebtoons.push({
      title: $el.find(".subj").text().trim(),
      url: $el.find("a").attr("href") || "",
      thumbnailUrl: $el.find("img").attr("src") || "",
      author: $el.find(".author").text().trim(),
      views: $el.find(".grade_num").text().trim(),
    });
  });

  const episodes = await scrapeEpisodes(url);

  return {
    title,
    url,
    thumbnailUrl,
    genre,
    author,
    status,
    authorDetail: {
      authorProfile,
      auth,
      desc,
      writer,
      andesc,
      anwriter,
    },
    rating,
    description,
    releaseDays,
    views,
    subscribers,
    episodes,
    suggestedWebtoons,
  };
}

export async function scrapeCompletedToons(): Promise<void> {
  const webtoons = await scrapeOriginalsPage();
  const completedWebtoons = webtoons.filter(
    (w) => w.status === WebtoonStatus.COMPLETED
  );

  for (const webtoon of completedWebtoons) {
    try {
      const details = await scrapeWebtoonDetails(webtoon.url);
      await saveWebtoonToDatabase(details);
      await updateWebtoonTrackingInfo(details, true);
    } catch (error) {
      logger.error(`Error scraping completed webtoon ${webtoon.title}:`, error);
    }
  }

  logger.info("Completed toons scraping finished");
}

export async function scrapeOngoingToons(): Promise<void> {
  const webtoons = await scrapeOriginalsOngoingPage();
  const ongoingWebtoons = webtoons.filter(
    (w) => w.status === WebtoonStatus.ONGOING
  );

  for (const webtoon of ongoingWebtoons) {
    try {
      const details = await scrapeWebtoonDetails(webtoon.url);
      await saveWebtoonToDatabase(details);
      // await updateWebtoonTrackingInfo(details, false);
    } catch (error) {
      logger.error(`Error scraping ongoing webtoon ${webtoon.title}:`, error);
    }
  }

  logger.info("Ongoing toons scraping finished");
}

export async function scrapeSpecificToon(url: string): Promise<void> {
  try {
    const details = await scrapeWebtoonDetails(url);
    await saveWebtoonToDatabase(details);
    await updateWebtoonTrackingInfo(
      details,
      details.status === WebtoonStatus.COMPLETED
    );
    logger.info(`Finished scraping: ${details.title}`);
  } catch (error) {
    logger.error(`Error scraping specific webtoon ${url}:`, error);
    throw error;
  }
}

/**
 * Fetches a page and returns a Cheerio instance
 * @param {string} url - The URL to fetch
 * @returns {Promise<cheerio.Root>} Cheerio instance
 */
async function fetchPage(url: string): Promise<cheerio.Root> {
  try {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  } catch (error) {
    logger.error(`Error fetching page ${url}:`, error);
    throw error;
  }
}
