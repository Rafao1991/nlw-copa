import { prisma } from "../libs/prisma";

export const createParticipant = async (pollId: string, userId: string) => {
  return prisma.participant.create({
    data: {
      pollId,
      userId,
    },
  });
};

export const findParticipantById = async (pollId: string, userId: string) => {
  return prisma.participant.findUnique({
    where: {
      userId_pollId: {
        pollId,
        userId,
      },
    },
  });
};
