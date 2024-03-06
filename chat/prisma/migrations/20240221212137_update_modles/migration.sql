/*
  Warnings:

  - You are about to drop the column `userId` on the `Msg` table. All the data in the column will be lost.
  - Added the required column `rec_id` to the `Msg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Msg` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Msg" DROP CONSTRAINT "Msg_userId_fkey";

-- AlterTable
ALTER TABLE "Msg" DROP COLUMN "userId",
ADD COLUMN     "rec_id" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Msg" ADD CONSTRAINT "Msg_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Msg" ADD CONSTRAINT "Msg_rec_id_fkey" FOREIGN KEY ("rec_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
