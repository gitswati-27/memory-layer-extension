import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";

export const createCollection = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;

    const collection =
      await prisma.collection.create({
        data: {
          name,
        },
      });

    res.status(201).json(collection);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create collection",
    });
  }
};

export const getCollections = async (
  req: Request,
  res: Response
) => {
  try {
    const collections =
      await prisma.collection.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(collections);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch collections",
    });
  }
};