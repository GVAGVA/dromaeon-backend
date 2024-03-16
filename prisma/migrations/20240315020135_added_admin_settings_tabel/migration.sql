-- CreateTable
CREATE TABLE "AdminSetting" (
    "id" TEXT NOT NULL,
    "maxEggs" INTEGER NOT NULL DEFAULT 100,
    "pickupCooldown" INTEGER NOT NULL DEFAULT 3600,

    CONSTRAINT "AdminSetting_pkey" PRIMARY KEY ("id")
);
