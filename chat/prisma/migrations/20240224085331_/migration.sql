/*
  Warnings:

  - You are about to drop the column `cid` on the `Msg` table. All the data in the column will be lost.
  - You are about to drop the column `checkAt` on the `Mute` table. All the data in the column will be lost.
  - Added the required column `coalition` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coalitionColor` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coalitionCover` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coalitionPic` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Msg" DROP CONSTRAINT "Msg_cid_fkey";

-- AlterTable
ALTER TABLE "Msg" DROP COLUMN "cid";

-- AlterTable
ALTER TABLE "Mute" DROP COLUMN "checkAt";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "coalition" TEXT NOT NULL,
ADD COLUMN     "coalitionColor" TEXT NOT NULL,
ADD COLUMN     "coalitionCover" TEXT NOT NULL,
ADD COLUMN     "coalitionPic" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "picture" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_ChannelToMsg" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToMsg_AB_unique" ON "_ChannelToMsg"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToMsg_B_index" ON "_ChannelToMsg"("B");

-- AddForeignKey
ALTER TABLE "_ChannelToMsg" ADD CONSTRAINT "_ChannelToMsg_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToMsg" ADD CONSTRAINT "_ChannelToMsg_B_fkey" FOREIGN KEY ("B") REFERENCES "Msg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
