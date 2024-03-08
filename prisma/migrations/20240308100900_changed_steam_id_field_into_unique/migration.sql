/*
  Warnings:

  - A unique constraint covering the columns `[steam_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_steam_id_key" ON "User"("steam_id");
