/*
  Warnings:

  - The primary key for the `Freindship` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Freindship` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Freindship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Freindship" DROP CONSTRAINT "Freindship_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Freindship_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "Freindship" ADD CONSTRAINT "Freindship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
