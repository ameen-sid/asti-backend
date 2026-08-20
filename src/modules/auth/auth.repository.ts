import { prisma } from '../../config/prisma.config';
import { User } from '@prisma/client';

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: number): Promise<User | null>;
}

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findFirst({ where: { email } });
  }

  async findUserById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }
}