import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

export class AuthFactory {

  private static authRepository: AuthRepository;
  private static authService: AuthService;
  private static authController: AuthController;

  static getAuthRepository(): AuthRepository {
    if (!this.authRepository) this.authRepository = new AuthRepository();
    return this.authRepository;
  }

  static getAuthService(): AuthService {
    if (!this.authService) this.authService = new AuthService(this.getAuthRepository());
    return this.authService;
  }

  static getAuthController(): AuthController {
    if (!this.authController) this.authController = new AuthController(this.getAuthService());
    return this.authController;
  }
}