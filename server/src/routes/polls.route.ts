import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../libs/prisma";
import { auth } from "../plugins/auth.plugin";
import { createParticipant } from "../repositories/participant.repository";
import {
  createPoll,
  findPollByCode,
  findPollById,
  listPollMatchesById,
  listPollsByParticipant,
  setPollOwner,
} from "../repositories/poll.repository";

export const pollsRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/polls/count", async () => {
    const count = await prisma.poll.count();
    return { count };
  });

  fastify.post("/polls/", async (request, reply) => {
    const createPollInput = z.object({
      title: z.string(),
    });

    const { title } = createPollInput.parse(request.body);

    let poll = null;

    try {
      await request.jwtVerify();
      const ownerId = request.user.id;
      poll = await createPoll(title, ownerId);
    } catch (error) {
      poll = await createPoll(title);
    }

    reply.status(201).send({ code: poll.code });
  });

  fastify.post(
    "/polls/:code/join",
    { onRequest: [auth] },
    async (request, reply) => {
      const joinPollInput = z.object({
        code: z.string(),
      });

      const { code } = joinPollInput.parse(request.params);

      const poll = await findPollByCode(code, request.user.id);

      if (!poll) {
        return reply.status(404).send({ message: "Poll not found" });
      }

      if (poll.participants.length > 0) {
        return reply.status(400).send({ message: "Already joined" });
      }

      await createParticipant(poll.id, request.user.id);

      if (!poll.ownerId) {
        await setPollOwner(poll.id, request.user.id);
      }

      reply.status(201).send();
    }
  );

  fastify.get("/polls/", { onRequest: [auth] }, async (request) => {
    const polls = await listPollsByParticipant(request.user.id);
    return { polls };
  });

  fastify.get("/polls/:id", { onRequest: [auth] }, async (request) => {
    const findPollInput = z.object({
      id: z.string(),
    });

    const { id } = findPollInput.parse(request.params);

    const poll = await findPollById(id);

    return { poll };
  });

  fastify.get("/polls/:id/matches", { onRequest: [auth] }, async (request) => {
    const findPollInput = z.object({
      id: z.string(),
    });

    const { id } = findPollInput.parse(request.params);

    const matches = await listPollMatchesById(id, request.user.id);

    return { matches };
  });
};
