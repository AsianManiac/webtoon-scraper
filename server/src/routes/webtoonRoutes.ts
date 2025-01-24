import { Router } from "express";
import {
  getToons,
  getWebtoonById,
  getWebtoonEpisodes,
  getWebtoons,
} from "../controllers/webtoonController";

const router = Router();

router.get("/", getWebtoons);
router.get("/toons", getToons);
router.get("/:id", getWebtoonById);
router.get("/:id/episodes", getWebtoonEpisodes);

export default router;
