import { Test, TestingModule } from '@nestjs/testing';
import { HoagieController } from './hoagie.controller';
import { HoagieService } from './hoagie.service';

describe('HoagieController', () => {
  let controller: HoagieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoagieController],
      providers: [
        {
          provide: HoagieService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HoagieController>(HoagieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
