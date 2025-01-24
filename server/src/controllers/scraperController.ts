import type { Request, Response } from "express";
import { triggerCronJob } from "../crons/dailyToonCron";
import {
  scrapeCompletedToons,
  scrapeOngoingToons,
  scrapeSpecificToon,
} from "../services/scraperService";

export const scrapeCompletedToon = async (req: Request, res: Response) => {
  try {
    await scrapeCompletedToons();
    res.json({ message: "Scraping of completed toons initiated" });
  } catch (error) {
    console.error("[SCRAPE_COMPLETED]", error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping completed toons" });
  }
};

export const scrapeOngoingToon = async (req: Request, res: Response) => {
  try {
    await scrapeOngoingToons();
    res.json({ message: "Scraping of ongoing toons initiated" });
  } catch (error) {
    console.error("[SCRAPE_ONGOING]", error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping ongoing toons" });
  }
};

export const scrapeSpecificToonData = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: "URL is required" });
    }
    await scrapeSpecificToon(url);
    res.json({ message: "Scraping of specific toon initiated" });
  } catch (error) {
    console.error("[SCRAPE_SPECIFIC]", error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping the specific toon" });
  }
};

export const triggerToonScrapeCronJob = async (req: Request, res: Response) => {
  try {
    await triggerCronJob();
    res.json({ message: "Cron job triggered successfully" });
  } catch (error) {
    console.error("[TRIGGER_CRON]", error);
    res
      .status(500)
      .json({ error: "An error occurred while triggering the cron job" });
  }
};
