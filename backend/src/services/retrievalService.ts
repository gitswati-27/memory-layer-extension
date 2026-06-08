import { prisma } from "../db/prisma.js";
import { generateEmbedding } from "./embeddingService.js";

export type RetrievedChunk = {
  content: string;
  memoryId: string;
  title: string;
  url: string;
  distance: number;
};

export async function retrieveRelevantChunks(
  query: string,
  limit = 5
): Promise<RetrievedChunk[]> {
  const embedding =
    await generateEmbedding(query);

  const vector =
    `[${embedding?.join(",")}]`;

  const results =
  await prisma.$queryRawUnsafe<RetrievedChunk[]>(`
    SELECT
  mc.content,
  mc."memoryId",
  m.title,
  m.url,
  mc.embedding <=> '${vector}'::vector
    AS distance
    FROM "MemoryChunk" mc
    JOIN "Memory" m
    ON mc."memoryId" = m.id
    WHERE mc.embedding IS NOT NULL
    ORDER BY mc.embedding <=> '${vector}'::vector
    LIMIT ${limit}
  `);

return results;
}