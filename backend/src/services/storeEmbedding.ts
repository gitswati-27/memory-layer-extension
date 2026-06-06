import { prisma } from "../db/prisma.js";

export async function storeEmbedding(
  chunkId: string,
  embedding: number[]
) {
  const vector = `[${embedding.join(",")}]`;

  await prisma.$executeRawUnsafe(`
    UPDATE "MemoryChunk"
    SET embedding = '${vector}'::vector
    WHERE id = '${chunkId}'
  `);
}