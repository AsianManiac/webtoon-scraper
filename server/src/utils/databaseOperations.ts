import { WebtoonStatus, type Webtoon } from "@prisma/client";
import { logger } from "../logger";
import type { WebtoonDetails } from "../types";
import { db } from "./prisma";

/**
 * Saves a webtoon to the database, updating it if it already exists.
 * @param webtoon Webtoon details to save.
 */
export async function saveWebtoonToDatabase(
  webtoon: WebtoonDetails
): Promise<void> {
  const existingWebtoon = await db.webtoon.findUnique({
    where: { url: webtoon.url },
  });

  if (existingWebtoon) {
    logger.info(`Updating existing webtoon: ${webtoon.title}`);

    const { toon } = await updateWebtoon(webtoon);
    updateWebtoonTrackingInfo(toon, true);
  } else {
    logger.info(`Saving new webtoon: ${webtoon.title}`);
    await createWebtoon(webtoon);
  }
}

async function createWebtoon(
  webtoon: WebtoonDetails
): Promise<{ toon: Webtoon }> {
  const toon = await db.webtoon.create({
    data: {
      url: webtoon.url,
      title: webtoon.title,
      author: webtoon.author,
      genre: webtoon.genre,
      rating: webtoon.rating.toString(),
      description: webtoon.description,
      thumbnailUrl: webtoon.thumbnailUrl,
      status: webtoon.status as WebtoonStatus,
      releaseDays: webtoon.releaseDays,
      views: webtoon.views.toString(),
      subscribers: webtoon.subscribers.toString(),
      episodes: {
        create: webtoon.episodes.map((episode) => ({
          number: episode.number,
          title: episode.title,
          uploadDate: episode.uploadDate,
          thumbnailUrl: episode.thumbnailUrl,
          url: episode.url,
          likes: episode.likes,
        })),
      },
      authorDetail: {
        create: webtoon.authorDetail,
      },
    },
  });

  return { toon };
}

async function updateWebtoon(
  webtoon: WebtoonDetails
): Promise<{ toon: Webtoon }> {
  const toon = await db.webtoon.update({
    where: { url: webtoon.url },
    data: {
      title: webtoon.title,
      author: webtoon.author,
      genre: webtoon.genre,
      rating: webtoon.rating.toString(),
      description: webtoon.description,
      thumbnailUrl: webtoon.thumbnailUrl,
      status: webtoon.status as WebtoonStatus,
      releaseDays: webtoon.releaseDays,
      views: webtoon.views.toString(),
      subscribers: webtoon.subscribers.toString(),
      episodes: {
        deleteMany: {},
        create: webtoon.episodes.map((episode) => ({
          number: episode.number,
          title: episode.title,
          uploadDate: episode.uploadDate,
          thumbnailUrl: episode.thumbnailUrl,
          url: episode.url,
          likes: episode.likes,
        })),
      },
      authorDetail: {
        update: webtoon.authorDetail,
      },
    },
  });

  return { toon };
}

/**
 * Updates tracking information for a webtoon.
 * @param webtoon Webtoon to update tracking info for.
 * @param isCompleted Whether the webtoon is completed.
 */
export async function updateWebtoonTrackingInfo(
  webtoon: Webtoon,
  isCompleted: boolean
): Promise<void> {
  const latestEpisode = await db.episode.findFirst({
    where: { webtoonId: webtoon.id },
    orderBy: [{ number: "desc" }, { uploadDate: "desc" }],
  });

  if (!latestEpisode) {
    logger.warn(`No episodes found for webtoon: ${webtoon.title}`);
    return;
  }

  const existingTracking = await db.tracking.findUnique({
    where: { webtoonId: webtoon.id },
  });

  if (existingTracking) {
    await db.tracking.update({
      where: { webtoonId: webtoon.id },
      data: {
        lastEpisode: latestEpisode.number,
        lastUpdateDate: new Date(latestEpisode.uploadDate),
        isCompleted,
      },
    });
  } else {
    await db.tracking.create({
      data: {
        webtoonId: webtoon.id,
        lastEpisode: latestEpisode.number,
        lastUpdateDate: new Date(latestEpisode.uploadDate),
        isCompleted,
      },
    });
  }

  logger.info(`Tracking info updated for webtoon: ${webtoon.title}`);
}
