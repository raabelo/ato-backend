/*
  Warnings:

  - You are about to drop the `_CardToDeck` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cards` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_CardToDeck_B_index";

-- DropIndex
DROP INDEX "_CardToDeck_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CardToDeck";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cards" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Deck_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Deck" ("id", "name", "ownerId") SELECT "id", "name", "ownerId" FROM "Deck";
DROP TABLE "Deck";
ALTER TABLE "new_Deck" RENAME TO "Deck";
CREATE UNIQUE INDEX "Deck_id_key" ON "Deck"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
