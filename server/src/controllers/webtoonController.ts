import { PrismaClient, WebtoonStatus } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export const getWebtoons = async (req: Request, res: Response) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 20;

    const skip = (pageNumber - 1) * pageSize;

    const [webtoons, totalCount] = await Promise.all([
      prisma.webtoon.findMany({
        where: status ? { status: status as WebtoonStatus } : undefined,
        include: { tracking: true, authorDetail: true },
        skip,
        take: pageSize,
      }),
      prisma.webtoon.count({
        where: status ? { status: status as WebtoonStatus } : undefined,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    res.json({
      message: "Result of toons.",
      results: webtoons,
      total: totalCount,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching webtoons" });
  }
};

export const getToons = async (req: Request, res: Response) => {
  try {
    const toons = await prisma.webtoon.findMany({
      select: {
        id: true,
        title: true,
        url: true,
      },
    });
    res.status(200).json(toons);
  } catch (error) {
    console.error("Error fetching toons:", error);
    res.status(500).json({ error: "Failed to fetch toons" });
  }
};

export const getWebtoonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const webtoon = await prisma.webtoon.findUnique({
      where: { id: parseInt(id) },
      include: {
        tracking: true,
        authorDetail: true,
        episodes: true,
        suggestedWebtoons: true,
      },
    });
    if (!webtoon) {
      res.status(404).json({ error: "Webtoon not found" });
    }
    res.json(webtoon);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the webtoon" });
  }
};

export const getWebtoonEpisodes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const episodes = await prisma.episode.findMany({
      where: { webtoonId: parseInt(id) },
      orderBy: { uploadDate: "desc" },
    });
    res.json(episodes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching episodes" });
  }
};

export const createWebtoon = async (req: Request, res: Response) => {
  try {
    const webtoonData = req.body;
    const newWebtoon = await prisma.webtoon.create({
      data: {
        ...webtoonData,
        authorDetail: { create: webtoonData.authorDetail },
        episodes: { create: webtoonData.episodes },
        suggestedWebtoons: { create: webtoonData.suggestedWebtoons },
        tracking: { create: webtoonData.tracking },
      },
    });
    res.status(201).json(newWebtoon);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the webtoon" });
  }
};

export const updateWebtoon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const webtoonData = req.body;
    const updatedWebtoon = await prisma.webtoon.update({
      where: { id: parseInt(id) },
      data: {
        ...webtoonData,
        authorDetail: { update: webtoonData.authorDetail },
        episodes: {
          deleteMany: {},
          create: webtoonData.episodes,
        },
        suggestedWebtoons: {
          deleteMany: {},
          create: webtoonData.suggestedWebtoons,
        },
        tracking: { update: webtoonData.tracking },
      },
    });
    res.json(updatedWebtoon);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the webtoon" });
  }
};

export const deleteWebtoon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.webtoon.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the webtoon" });
  }
};
