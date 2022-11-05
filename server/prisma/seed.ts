import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const userData: Prisma.UserCreateInput = {
    name: "John Doe",
    email: "john_doe@email.com",
    avatar: "https://github.com/rafao1991.png",
  };
  const user = await prisma.user.create({
    data: userData,
  });

  const pollData: Prisma.PollCreateInput = {
    title: "1st Poll",
    code: "1STPOL",
    owner: {
      connect: {
        id: user.id,
      },
    },
    participants: {
      create: {
        userId: user.id,
      },
    },
  };
  const poll = await prisma.poll.create({
    data: pollData,
  });

  const matchData: Prisma.MatchCreateInput = {
    date: new Date("2022-11-07T12:00:00.000Z"),
    firstTeamCountryCode: "BR",
    secondTeamCountryCode: "DE",
  };
  const match = await prisma.match.create({
    data: matchData,
  });

  const matchDataWithGuess: Prisma.MatchCreateInput = {
    date: new Date("2022-11-07T16:00:00.000Z"),
    firstTeamCountryCode: "BR",
    secondTeamCountryCode: "AR",
    guesses: {
      create: {
        firstTeamScore: 2,
        secondTeamScore: 1,
        participant: {
          connect: {
            userId_pollId: {
              userId: user.id,
              pollId: poll.id,
            },
          },
        },
      },
    },
  };
  const matchWithGuess = await prisma.match.create({
    data: matchDataWithGuess,
  });
};

main();
