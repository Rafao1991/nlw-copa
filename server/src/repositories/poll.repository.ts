import ShortUniqueId from "short-unique-id";
import { prisma } from "../libs/prisma";

export const createPoll = async (title: string, ownerId?: string) => {
  const codeGenerator = new ShortUniqueId({ length: 6 });

  if (!ownerId) {
    const poll = await prisma.poll.create({
      data: {
        title,
        code: codeGenerator().toUpperCase(),
      },
    });

    return poll;
  }

  const poll = await prisma.poll.create({
    data: {
      title,
      code: codeGenerator().toUpperCase(),
      ownerId: ownerId,
      participants: {
        create: {
          userId: ownerId,
        },
      },
    },
  });

  return poll;
};

export const findPollByCode = async (code: string, userId?: string) => {
  const poll = await prisma.poll.findUnique({
    where: {
      code,
    },
    include: {
      participants: {
        where: {
          userId,
        },
      },
    },
  });

  return poll;
};

export const findPollById = async (id: string) => {
  const poll = await prisma.poll.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          participants: true,
        },
      },
      participants: {
        select: {
          user: {
            select: {
              avatar: true,
            },
          },
        },
      },
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  return poll;
};

export const listPollsByParticipant = async (userId: string) => {
  const polls = await prisma.poll.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    include: {
      _count: {
        select: {
          participants: true,
        },
      },
      participants: {
        select: {
          user: {
            select: {
              avatar: true,
            },
          },
        },
      },
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  return polls;
};

export const listPollMatchesById = async (pollId: string, userId: string) => {
  const matches = await prisma.match.findMany({
    orderBy: {
      date: "desc",
    },
    include: {
      guesses: {
        where: {
          participant: {
            userId,
            pollId,
          },
        },
      },
    },
  });

  return matches.map((match) => {
    return {
      ...match,
      guess: match.guesses.length > 0 ? match.guesses[0] : null,
      guesses: undefined,
    };
  });
};

export const setPollOwner = async (id: string, ownerId: string) => {
  const poll = await prisma.poll.update({
    where: {
      id,
    },
    data: {
      ownerId,
    },
  });

  return poll;
};
