import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../../config/index.js';
import { IAuthRepository } from './auth.repository';
import { UnauthorizedError } from '../../shared/utils/errors/app.error';

export interface IAuthService {
  login(email: string, password: string): Promise<{ token: string; user: { id: number; name: string; email: string; role: string } }>;
  logout(): Promise<boolean>;
}

export class AuthService implements IAuthService {

  private authRepository: IAuthRepository;
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user)  throw new UnauthorizedError('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      serverConfig.JWT_SECRET,
      { expiresIn: serverConfig.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(): Promise<boolean> {
    // Stateless JWT logout logic
    return true;
  }
}