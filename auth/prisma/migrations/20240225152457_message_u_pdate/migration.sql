-- DropForeignKey
ALTER TABLE "Mute" DROP CONSTRAINT "Mute_cid_fkey";

-- AlterTable
ALTER TABLE "Mute" ALTER COLUMN "cid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Mute" ADD CONSTRAINT "Mute_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
