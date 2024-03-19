/*
  Warnings:

  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "character" INTEGER NOT NULL,
    "activeDeck" INTEGER NOT NULL,
    "packs" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "rank" INTEGER DEFAULT 0,
    "dust" INTEGER DEFAULT 0,
    "gold" INTEGER DEFAULT 0,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT DEFAULT 'USER'
);
INSERT INTO "new_User" ("activeDeck", "character", "collection", "dust", "email", "gold", "id", "nickname", "packs", "password", "rank", "title") SELECT "activeDeck", "character", "collection", "dust", "email", "gold", "id", "nickname", "packs", "password", "rank", "title" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
