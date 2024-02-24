/*
  Warnings:

  - You are about to drop the column `history` on the `Msg` table. All the data in the column will be lost.
  - You are about to drop the column `unsent` on the `Msg` table. All the data in the column will be lost.
  - You are about to drop the column `blocked` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Msg" DROP COLUMN "history",
DROP COLUMN "unsent";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "blocked";
