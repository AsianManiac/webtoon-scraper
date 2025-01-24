import { setupCronJob } from "./crons/dailyToonCron";
import { scrapeAll } from "./scraper";
import { logger } from "./utils/logger";

async function main() {
  try {
    logger.info("Starting WEBTOON scraper...");
    await scrapeAll();
    logger.info("Scraping completed successfully.");

    setupCronJob();
    logger.info("Cron job set up for daily updates.");
  } catch (error) {
    logger.error("An error occurred during scraping:", error);
  }
}

main();
