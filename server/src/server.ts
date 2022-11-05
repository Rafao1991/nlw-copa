import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";
import { authRoutes } from "./routes/auth.route";
import { guessesRoutes } from "./routes/guesses.route";
import { pollsRoutes } from "./routes/polls.route";
import { usersRoutes } from "./routes/users.route";

async function bootsrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(authRoutes);
  await fastify.register(guessesRoutes);
  await fastify.register(pollsRoutes);
  await fastify.register(usersRoutes);

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string,
  });

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootsrap();
