import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";

export const saveMemory = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, url, content } = req.body;

    const memory = await prisma.memory.create({
      data: {
        title,
        url,
        content,
      },
    });

    res.status(201).json(memory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to save memory",
    });
  }
};