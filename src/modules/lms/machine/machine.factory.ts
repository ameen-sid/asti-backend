import { MachineRepository } from './machine.repository';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';

export class MachineFactory {

  private static machineRepository: MachineRepository;
  private static machineService: MachineService;
  private static machineController: MachineController;

  static getMachineRepository(): MachineRepository {
    if (!this.machineRepository) this.machineRepository = new MachineRepository();
    return this.machineRepository;
  }

  static getMachineService(): MachineService {
    if (!this.machineService) this.machineService = new MachineService(this.getMachineRepository());
    return this.machineService;
  }

  static getMachineController(): MachineController {
    if (!this.machineController) this.machineController = new MachineController(this.getMachineService());
    return this.machineController;
  }
}