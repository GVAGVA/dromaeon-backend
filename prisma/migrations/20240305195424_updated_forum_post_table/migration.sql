/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `ForumChannel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserChatRoom" ADD COLUMN     "visibility" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "ForumChannel_title_key" ON "ForumChannel"("title");
