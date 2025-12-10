-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "namePt" TEXT NOT NULL,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "descriptionPt" TEXT,
    "price" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "image" TEXT,
    "descriptionFr" TEXT
);
