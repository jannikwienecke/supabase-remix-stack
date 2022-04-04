import type { Password, profiles } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { profiles } from "@prisma/client";

export async function getUserById(id: profiles["id"]) {
  console.log("__id: ", id);

  return prisma.profiles.findUnique({ where: { id } });
}

export async function getUserByEmail(email: profiles["email"]) {
  return prisma.profiles.findUnique({ where: { email } });
}

export async function createUser(email: profiles["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.profiles.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: profiles["email"]) {
  return prisma.profiles.delete({ where: { email } });
}

export async function verifyLogin(
  email: profiles["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.profiles.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
