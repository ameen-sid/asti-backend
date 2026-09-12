import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger.config';
import { IUserService } from './user.service';

export class UserController {

  private userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }

  addUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Creating User', { body: req.body });
    const newUser = await this.userService.addUser(req.body.name, req.body.email, req.body.password, req.body.role);
    logger.info('User Created Successfully', { user: newUser });
    res.status(201).json({
      success: true,
      message: 'User Created Successfully',
      data: newUser,
    });
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching Users', { query: req.query });
    const page = Math.max(1, parseInt(req.query.page as string || '1'));
    const limit = Math.max(1, parseInt(req.query.limit as string || '1000'));
    const search = (req.query.search as string || '').trim();
    const role = (req.query.role as string || '').trim();
    const sortBy = (req.query.sortBy as string || 'createdAt');
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const users = await this.userService.getUsers(where, sortBy, sortOrder, skip, limit);
    logger.info('Fetched Users Successfully', { users });
    res.status(200).json({
      success: true,
      message: 'Fetched Users Successfully',
      data: users,
    });
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching User by ID', { id: req.params.id });
    const user = await this.userService.getUserById(Number(req.params.id));
    logger.info('Fetched User Successfully', { user });
    res.status(200).json({
      success: true,
      message: 'Fetched User Successfully',
      data: user,
    });
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Updating User', { body: req.body, id: req.params.id });
    const updatedUser = await this.userService.updateUser(
      Number(req.params.id),
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.role
    );
    logger.info('Updated User Successfully', { user: updatedUser });
    res.status(200).json({
      success: true,
      message: 'Updated User Successfully',
      data: updatedUser,
    });
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Deleting User', { id: req.params.id });
    const deletedUser = await this.userService.deleteUser(Number(req.params.id));
    logger.info('Deleted User Successfully', { data: deletedUser });
    res.status(200).json({
      success: true,
      message: 'Deleted User Successfully',
      data: deletedUser,
    });
  }
}