import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

export class EmployeeFactory {

  private static employeeRepository: EmployeeRepository;
  private static employeeService: EmployeeService;
  private static employeeController: EmployeeController;

  static getEmployeeRepository(): EmployeeRepository {
    if (!this.employeeRepository) this.employeeRepository = new EmployeeRepository();
    return this.employeeRepository;
  }

  static getEmployeeService(): EmployeeService {
    if (!this.employeeService) this.employeeService = new EmployeeService(this.getEmployeeRepository());
    return this.employeeService;
  }

  static getEmployeeController(): EmployeeController {
    if (!this.employeeController) this.employeeController = new EmployeeController(this.getEmployeeService());
    return this.employeeController;
  }
}