import { prisma } from "../libs/prisma";

export const findMatchById = async (id: string) => {
  return prisma.match.findUnique({
    where: {
      id,
    },
  });
};
