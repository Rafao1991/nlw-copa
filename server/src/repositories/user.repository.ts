import axios from "axios";
import { z } from "zod";
import { prisma } from "../libs/prisma";

export const getUserFromGoogle = async (token: string): Promise<GoogleUser> => {
  const googleUserResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const userInput = z.object({
    name: z.string(),
    email: z.string().email(),
    picture: z.string().url(),
  });

  return userInput.parse(googleUserResponse.data);
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const createUser = async (
  name: string,
  email: string,
  avatar: string
) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      avatar,
    },
  });
};
