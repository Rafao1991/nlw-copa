import { FastifyRequest } from "fastify";

export const auth = async (request: FastifyRequest) => {
  await request.jwtVerify();
};
