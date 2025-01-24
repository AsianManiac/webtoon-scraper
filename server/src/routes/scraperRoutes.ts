import { Router } from "express";
import {
  scrapeCompletedToon,
  scrapeOngoingToon,
  scrapeSpecificToonData,
  triggerToonScrapeCronJob,
} from "../controllers/scraperController";

const router = Router();

router.post("/completed", scrapeCompletedToon);
router.post("/ongoing", scrapeOngoingToon);
router.post("/toon", scrapeSpecificToonData);
router.post("/trigger-cron", triggerToonScrapeCronJob);

export default router;
