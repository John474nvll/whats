
import prisma from '../../core/database';
import bcrypt from 'bcrypt';

export const createUser = async (userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
    },
  });
};

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};
