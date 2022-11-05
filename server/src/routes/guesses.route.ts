import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../libs/prisma";
import { auth } from "../plugins/auth.plugin";
import {
  createGuess,
  findGuessByMatchIdAndParticipant,
} from "../repositories/guess.repository";
import { findMatchById } from "../repositories/match.repository";
import { findParticipantById } from "../repositories/participant.repository";

export const guessesRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count };
  });

  fastify.post("/guesses/", { onRequest: [auth] }, async (request, reply) => {
    const createGuessInput = z.object({
      matchId: z.string(),
      pollId: z.string(),
      firstTeamScore: z.number(),
      secondTeamScore: z.number(),
    });

    const { matchId, pollId, firstTeamScore, secondTeamScore } =
      createGuessInput.parse(request.body);

    const userId = request.user.id;

    const participant = await findParticipantById(pollId, userId);

    if (!participant) {
      return reply
        .status(404)
        .send({ message: "Participant not found for this poll" });
    }

    const guess = await findGuessByMatchIdAndParticipant(
      matchId,
      participant.userId,
      participant.pollId
    );

    if (guess) {
      return reply
        .status(400)
        .send({ message: "Guess already exists for this match" });
    }

    const match = await findMatchById(matchId);

    if (!match) {
      return reply.status(404).send({ message: "Match not found" });
    }

    if (match.date < new Date()) {
      return reply.status(400).send({ message: "Match already started" });
    }

    const createdGuess = await createGuess(
      matchId,
      pollId,
      userId,
      firstTeamScore,
      secondTeamScore
    );

    return reply.status(201).send(createdGuess);
  });
};
