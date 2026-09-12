import { prisma } from '../../config/prisma.config';
import { User } from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password'>;

export interface IUserRepository {
  addUser(name: string, email: string, password: string, role: string): Promise<UserWithoutPassword>;
  getUsers(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<UserWithoutPassword[]>;
  getUserById(id: number): Promise<UserWithoutPassword | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: number, name?: string, email?: string, password?: string, role?: string): Promise<UserWithoutPassword | null>;
  deleteUser(id: number): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  private static userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  };

  async addUser(name: string, email: string, password: string, role: string): Promise<UserWithoutPassword> {
    return await prisma.user.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), password, role },
      select: UserRepository.userSelect,
    });
  }

  async getUsers(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<UserWithoutPassword[]> {
    return await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      select: UserRepository.userSelect,
    });
  }

  async getUserById(id: number): Promise<UserWithoutPassword | null> {
    return await prisma.user.findUnique({ where: { id }, select: UserRepository.userSelect });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findFirst({ where: { email: email.trim().toLowerCase() } });
  }

  async updateUser(id: number, name?: string, email?: string, password?: string, role?: string): Promise<UserWithoutPassword | null> {
    return await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(email !== undefined && { email: email.trim().toLowerCase() }),
        ...(password !== undefined && { password }),
        ...(role !== undefined && { role }),
      },
      select: UserRepository.userSelect,
    });
  }

  async deleteUser(id: number): Promise<boolean> {
    return await prisma.user.delete({ where: { id } }) ? true : false;
  }
}