import { Test, TestingModule } from '@nestjs/testing';
import { CategriesService } from './categries.service';

describe('CategriesService', () => {
  let service: CategriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategriesService],
    }).compile();

    service = module.get<CategriesService>(CategriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
