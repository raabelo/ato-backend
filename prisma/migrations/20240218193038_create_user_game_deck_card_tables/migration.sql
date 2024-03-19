-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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

-- CreateTable
CREATE TABLE "Game" (
    "session" TEXT NOT NULL PRIMARY KEY,
    "state" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "ages" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Deck_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pantheon" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "atk" INTEGER DEFAULT 0,
    "def" INTEGER DEFAULT 0,
    "rarity" INTEGER NOT NULL,
    "variant" TEXT NOT NULL,
    "text" TEXT DEFAULT '',
    "art" TEXT DEFAULT '',
    "flavor" TEXT DEFAULT '',
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToGame" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserToGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Game" ("session") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserToGame_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CardToDeck" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CardToDeck_A_fkey" FOREIGN KEY ("A") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CardToDeck_B_fkey" FOREIGN KEY ("B") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Game_session_key" ON "Game"("session");

-- CreateIndex
CREATE UNIQUE INDEX "Deck_id_key" ON "Deck"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Card_id_key" ON "Card"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToGame_AB_unique" ON "_UserToGame"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToGame_B_index" ON "_UserToGame"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToDeck_AB_unique" ON "_CardToDeck"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToDeck_B_index" ON "_CardToDeck"("B");
