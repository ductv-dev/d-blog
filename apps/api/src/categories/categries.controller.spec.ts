import { Test, TestingModule } from '@nestjs/testing';
import { CategriesController } from './categries.controller';
import { CategriesService } from './categries.service';

describe('CategriesController', () => {
  let controller: CategriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategriesController],
      providers: [CategriesService],
    }).compile();

    controller = module.get<CategriesController>(CategriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
