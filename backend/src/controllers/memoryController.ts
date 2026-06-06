import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { chunkText } from "../utils/chunkText.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { storeEmbedding } from "../services/storeEmbedding.js";

export const saveMemory = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, url, content, collectionId} = req.body;

    const memory = await prisma.memory.create({
      data: {
        title,
        url,
        content,
        collectionId,
      },
    });

    const chunks = chunkText(content);

    const createdChunks = await Promise.all(
      chunks.map((chunk) =>
      prisma.memoryChunk.create({
      data: {
          content: chunk,
          memoryId: memory.id,
        },
      })
      )
    );

    for (const chunk of createdChunks) {
      const embedding =
        await generateEmbedding(
          chunk.content
        );

      if (embedding) {
        await storeEmbedding(
        chunk.id,
        embedding
      );
      }
    }

    res.status(201).json(memory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to save memory",
    });
  }
};

export const getMemories = async (
  req: Request,
  res: Response
) => {
  try {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(memories);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch memories",
    });
  }
};

export const deleteMemory = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    await prisma.memory.delete({
      where: { id },
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete memory",
    });
  }
};

export const getRecentMemories = async (
  req: Request,
  res: Response
) => {
  try {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    res.json(memories);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch recent memories",
    });
  }
};

export const searchMemories = async (
  req: Request,
  res: Response
) => {
  const query = req.query.q as string;

  const memories = await prisma.memory.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(memories);
};

export const getMemoriesByCollection =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const collectionId =
        req.params.collectionId as string;

      const memories =
        await prisma.memory.findMany({
          where: {
            collectionId,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(memories);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to fetch collection memories",
      });
    }
  };