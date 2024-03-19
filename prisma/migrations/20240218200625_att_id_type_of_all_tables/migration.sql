/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Deck` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("activeDeck", "character", "collection", "dust", "email", "gold", "id", "nickname", "packs", "password", "rank", "title") SELECT "activeDeck", "character", "collection", "dust", "email", "gold", "id", "nickname", "packs", "password", "rank", "title" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new__CardToDeck" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CardToDeck_A_fkey" FOREIGN KEY ("A") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CardToDeck_B_fkey" FOREIGN KEY ("B") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CardToDeck" ("A", "B") SELECT "A", "B" FROM "_CardToDeck";
DROP TABLE "_CardToDeck";
ALTER TABLE "new__CardToDeck" RENAME TO "_CardToDeck";
CREATE UNIQUE INDEX "_CardToDeck_AB_unique" ON "_CardToDeck"("A", "B");
CREATE INDEX "_CardToDeck_B_index" ON "_CardToDeck"("B");
CREATE TABLE "new_Deck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ages" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Deck_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Deck" ("ages", "id", "name", "ownerId") SELECT "ages", "id", "name", "ownerId" FROM "Deck";
DROP TABLE "Deck";
ALTER TABLE "new_Deck" RENAME TO "Deck";
CREATE UNIQUE INDEX "Deck_id_key" ON "Deck"("id");
CREATE TABLE "new__UserToGame" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserToGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Game" ("session") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserToGame_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__UserToGame" ("A", "B") SELECT "A", "B" FROM "_UserToGame";
DROP TABLE "_UserToGame";
ALTER TABLE "new__UserToGame" RENAME TO "_UserToGame";
CREATE UNIQUE INDEX "_UserToGame_AB_unique" ON "_UserToGame"("A", "B");
CREATE INDEX "_UserToGame_B_index" ON "_UserToGame"("B");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
