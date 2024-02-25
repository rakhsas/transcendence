/*
  Warnings:

  - You are about to drop the column `friends` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "friends";

-- CreateTable
CREATE TABLE "Freindship" (
    "id" SERIAL NOT NULL,
    "freindId" INTEGER NOT NULL,

    CONSTRAINT "Freindship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Freindship" ADD CONSTRAINT "Freindship_freindId_fkey" FOREIGN KEY ("freindId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
