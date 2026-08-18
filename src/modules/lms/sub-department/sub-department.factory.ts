import { SubDepartmentRepository } from './sub-department.repository';
import { SubDepartmentService } from './sub-department.service';
import { SubDepartmentController } from './sub-department.controller';

export class SubDepartmentFactory {

  private static subDepartmentRepository: SubDepartmentRepository;
  private static subDepartmentService: SubDepartmentService;
  private static subDepartmentController: SubDepartmentController;

  static getSubDepartmentRepository(): SubDepartmentRepository {
    if (!this.subDepartmentRepository) this.subDepartmentRepository = new SubDepartmentRepository();
    return this.subDepartmentRepository;
  }

  static getSubDepartmentService(): SubDepartmentService {
    if (!this.subDepartmentService) this.subDepartmentService = new SubDepartmentService(this.getSubDepartmentRepository());
    return this.subDepartmentService;
  }

  static getSubDepartmentController(): SubDepartmentController {
    if (!this.subDepartmentController) this.subDepartmentController = new SubDepartmentController(this.getSubDepartmentService());
    return this.subDepartmentController;
  }
}