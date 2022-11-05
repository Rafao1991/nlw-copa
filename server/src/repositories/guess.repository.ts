import { prisma } from "../libs/prisma";

export const findGuessByMatchIdAndParticipant = async (
  matchId: string,
  userId: string,
  pollId: string
) => {
  return prisma.guess.findUnique({
    where: {
      userId_pollId_matchId: {
        userId,
        pollId,
        matchId,
      },
    },
  });
};

export const createGuess = async (
  matchId: string,
  pollId: string,
  userId: string,
  firstTeamScore: number,
  secondTeamScore: number
) => {
  return prisma.guess.create({
    data: {
      matchId,
      pollId,
      userId,
      firstTeamScore,
      secondTeamScore,
    },
  });
};
