import cron from "node-cron";
import { scrapeOngoingToons } from "../services/scraperService";
import { logger } from "../utils/logger";

export function setupCronJob(): void {
  cron.schedule("0 0 * * *", async () => {
    logger.info("Running daily update...");
    try {
      await scrapeOngoingToons();
      logger.info("Daily update completed successfully.");
    } catch (error) {
      logger.error("An error occurred during daily update:", error);
    }
  });
}

export async function triggerCronJob(): Promise<void> {
  logger.info("Manually triggering cron job...");
  try {
    await scrapeOngoingToons();
    logger.info("Manual update completed successfully.");
  } catch (error) {
    logger.error("An error occurred during manual update:", error);
    throw error;
  }
}
