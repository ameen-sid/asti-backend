import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger.config';
import { IAuthService } from './auth.service';

export class AuthController {

  private authService: IAuthService;
  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('User Login Attempt', { email: req.body.email });
    const result = await this.authService.login(req.body.email, req.body.password);
    logger.info('User Logged In Successfully', { userId: result.user.id });
    res.status(200).json({
      success: true,
      message: 'Login Successful',
      data: result,
    });
  }

  logout = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('User Logout Attempt');
    await this.authService.logout();
    logger.info('User Logged Out Successfully');
    res.status(200).json({
      success: true,
      message: 'Logout Successful',
    });
  }
}