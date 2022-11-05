import { FastifyInstance } from "fastify";
import { z } from "zod";
import { auth } from "../plugins/auth.plugin";
import {
  createUser,
  findUserByEmail,
  getUserFromGoogle,
} from "../repositories/user.repository";

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/auth/", async (request) => {
    const authInput = z.object({
      accessToken: z.string(),
    });

    const { accessToken } = authInput.parse(request.body);

    const { name, email, picture } = await getUserFromGoogle(accessToken);

    let user = await findUserByEmail(email);

    if (!user) {
      user = await createUser(name, email, picture);
    }

    const token = fastify.jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      {
        sub: user.id,
        expiresIn: "1h",
      }
    );

    return { token };
  });

  fastify.get("/auth/me", { onRequest: [auth] }, async (request) => {
    return { user: request.user };
  });
};
