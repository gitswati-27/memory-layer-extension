/*
  Warnings:

  - You are about to drop the column `summary` on the `Memory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "summary",
ADD COLUMN     "collectionId" TEXT;

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_key" ON "Collection"("name");

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
