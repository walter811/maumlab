import { Test, TestingModule } from '@nestjs/testing';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';

class MockReplyService {}

describe('ReplyController', () => {
  let controller: ReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReplyController],
      providers: [{ provide: ReplyService, useClass: MockReplyService }],
    }).compile();

    controller = module.get<ReplyController>(ReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
