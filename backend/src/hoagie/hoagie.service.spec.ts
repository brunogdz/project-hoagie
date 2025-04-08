import { Test, TestingModule } from '@nestjs/testing';
import { HoagieService } from './hoagie.service';

describe('HoagieService', () => {
  let service: HoagieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoagieService],
    }).compile();

    service = module.get<HoagieService>(HoagieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
