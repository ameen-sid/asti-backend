import bcrypt from 'bcrypt';
import { IUserRepository, UserWithoutPassword } from './user.repository';
import { BadRequestError, ConflictError, NotFoundError } from '../../shared/utils/errors/app.error';

export interface IUserService {
  addUser(name: string, email: string, password: string, role: string): Promise<UserWithoutPassword>;
  getUsers(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<UserWithoutPassword[]>;
  getUserById(id: number): Promise<UserWithoutPassword>;
  updateUser(id: number, name?: string, email?: string, password?: string, role?: string): Promise<UserWithoutPassword | null>;
  deleteUser(id: number): Promise<boolean>;
}

export class UserService implements IUserService {

  private userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  private normalizeRole(role: string): string {
    const lower = role.trim().toLowerCase();
    if (lower === 'super admin' || lower === 'superadmin') return 'Super Admin';
    if (lower === 'admin') return 'Admin';
    return role.trim();
  }

  async addUser(name: string, email: string, password: string, role: string): Promise<UserWithoutPassword> {
    if (!name) throw new BadRequestError('Portal name is required');
    if (!email) throw new BadRequestError('Email address is required');
    if (!password) throw new BadRequestError('Password is required');
    if (!role) throw new BadRequestError('Role is required');

    const existing = await this.userRepository.getUserByEmail(email);
    if (existing)	throw new ConflictError(`User with email '${email}' already exists`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedRole = this.normalizeRole(role);
    return await this.userRepository.addUser(name, email, hashedPassword, normalizedRole);
  }

  async getUsers(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<UserWithoutPassword[]> {
    return await this.userRepository.getUsers(where, sortBy, sortOrder, skip, limit);
  }

  async getUserById(id: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.getUserById(id);
    if (!user)	throw new NotFoundError(`User with ID ${id} not found`);
    return user;
  }

  async updateUser(id: number, name?: string, email?: string, password?: string, role?: string): Promise<UserWithoutPassword | null> {
    const user = await this.userRepository.getUserById(id);
    if (!user)	throw new NotFoundError(`User with ID ${id} not found`);

    if (name !== undefined && !name.trim())	throw new BadRequestError('Portal name cannot be empty');
    if (email !== undefined) {
      const existing = await this.userRepository.getUserByEmail(email);
      if (existing && existing.id !== id)	throw new ConflictError(`User with email '${email}' already exists`);
    }

    let hashedPassword: string | undefined = undefined;
    if (password !== undefined) {
      if (!password) throw new BadRequestError('Password cannot be empty');
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const normalizedRole = role !== undefined ? this.normalizeRole(role) : undefined;
    return await this.userRepository.updateUser(id, name, email, hashedPassword, normalizedRole);
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this.userRepository.deleteUser(id);
  }
}