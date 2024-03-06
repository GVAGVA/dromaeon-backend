-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "egg_picked_at" TIMESTAMP(3) NOT NULL,
    "copper" INTEGER NOT NULL DEFAULT 0,
    "silver" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "lifetime_collected" INTEGER NOT NULL DEFAULT 0,
    "x" INTEGER NOT NULL DEFAULT 50,
    "y" INTEGER NOT NULL DEFAULT 50,
    "is_admin" BOOLEAN NOT NULL,
    "is_banned" BOOLEAN NOT NULL,
    "policy_check" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_game_id_key" ON "User"("game_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");
