/*
  Warnings:

  - Made the column `cid` on table `Mute` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Msg" DROP CONSTRAINT "Msg_cid_fkey";

-- DropForeignKey
ALTER TABLE "Mute" DROP CONSTRAINT "Mute_cid_fkey";

-- AlterTable
ALTER TABLE "Msg" ALTER COLUMN "cid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Mute" ALTER COLUMN "cid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Msg" ADD CONSTRAINT "Msg_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mute" ADD CONSTRAINT "Mute_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
