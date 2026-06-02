import type { Request, Response } from "express";

export const saveMemory = async (
  req: Request,
  res: Response
) => {
  console.log(req.body);

  res.status(200).json({
    success: true,
  });
};