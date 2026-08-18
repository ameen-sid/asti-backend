import { LineRepository } from './line.repository';
import { LineService } from './line.service';
import { LineController } from './line.controller';

export class LineFactory {

  private static lineRepository: LineRepository;
  private static lineService: LineService;
  private static lineController: LineController;

  static getLineRepository(): LineRepository {
    if (!this.lineRepository) this.lineRepository = new LineRepository();
    return this.lineRepository;
  }

  static getLineService(): LineService {
    if (!this.lineService) this.lineService = new LineService(this.getLineRepository());
    return this.lineService;
  }

  static getLineController(): LineController {
    if (!this.lineController) this.lineController = new LineController(this.getLineService());
    return this.lineController;
  }
}