-- CreateTable
CREATE TABLE "Pack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "itemsFr" TEXT NOT NULL,
    "itemsEn" TEXT NOT NULL,
    "itemsPt" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "recommendedFor" TEXT NOT NULL,
    "image" TEXT
);
