import { SectionRepository } from './section.repository';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';

export class SectionFactory {

  private static sectionRepository: SectionRepository;
  private static sectionService: SectionService;
  private static sectionController: SectionController;

  static getSectionRepository(): SectionRepository {
    if (!this.sectionRepository) this.sectionRepository = new SectionRepository();
    return this.sectionRepository;
  }

  static getSectionService(): SectionService {
    if (!this.sectionService) this.sectionService = new SectionService(this.getSectionRepository());
    return this.sectionService;
  }

  static getSectionController(): SectionController {
    if (!this.sectionController) this.sectionController = new SectionController(this.getSectionService());
    return this.sectionController;
  }
}