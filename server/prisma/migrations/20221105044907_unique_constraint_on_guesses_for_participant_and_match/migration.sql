/*
  Warnings:

  - A unique constraint covering the columns `[userId,pollId,matchId]` on the table `Guess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guess_userId_pollId_matchId_key" ON "Guess"("userId", "pollId", "matchId");
