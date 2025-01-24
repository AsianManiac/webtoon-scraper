import { PrismaClient, WebtoonStatus } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { logger } from "./utils/logger";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const jsonData = await fs.readFile(
      path.join(__dirname, "../toons/all_webtoons.json"),
      "utf-8"
    );
    const webtoons = JSON.parse(jsonData);
    for (const webtoon of webtoons) {
      try {
        const existingWebtoon = await prisma.webtoon.findUnique({
          where: { url: webtoon.url },
        });

        if (existingWebtoon) {
          logger.info(`Skipping existing webtoon: ${webtoon.title}`);
          continue;
        }

        await prisma.webtoon.create({
          data: {
            title: webtoon.title,
            url: webtoon.url,
            author: webtoon.author,
            genre: webtoon.genre,
            rating: webtoon.rating || "",
            description: webtoon.description,
            thumbnailUrl: webtoon.thumbnailUrl,
            status: webtoon.status as WebtoonStatus,
            releaseDays: webtoon.releaseDays,
            views: webtoon.views,
            subscribers: webtoon.subscribers,
            // authorDetail: {
            //   create: {
            //     authorProfile: webtoon.authorDetail.authorProfile || "",
            //     auth: webtoon.authorDetail.auth || "",
            //     desc: webtoon.authorDetail.desc || "",
            //     writer: webtoon.authorDetail.writer || "",
            //     andesc: webtoon.authorDetail.andesc || "",
            //     anwriter: webtoon.authorDetail.anwriter || "",
            //   },
            // },
            episodes: {
              create: webtoon.episodes.map((episode: any) => ({
                number: episode.number,
                title: episode.title,
                uploadDate: episode.uploadDate,
                thumbnailUrl: episode.thumbnailUrl,
                url: episode.url,
                likes: episode.likes,
              })),
            },
            // suggestedWebtoons: {
            //   create: webtoon.suggestedWebtoons.map((suggested: any) => ({
            //     title: suggested.title,
            //     url: suggested.url,
            //     thumbnailUrl: suggested.thumbnailUrl,
            //     author: suggested.author,
            //     views: suggested.views,
            //   })),
            // },
          },
        });

        logger.info(`Webtoon seeded successfully: ${webtoon.title}`);
      } catch (error) {
        logger.error(`Error seeding webtoon ${webtoon.title}:`, error);
      }
    }

    logger.info("Database seeding completed");
  } catch (error) {
    logger.error("Error reading or parsing JSON file:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase().catch((error) => {
  logger.error("Unhandled error during database seeding:", error);
  process.exit(1);
});
