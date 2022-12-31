import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Reply } from '../entities/reply.entity';
import { User } from '../entities/user.entity';
import { ReplyService } from './reply.service';

class MockUserRepository {
  #data = [
    { id: 1, email: 'walter811@naver.com' },
    { id: 2, email: 'kimss6586@gmail.com' },
  ];
  findOneBy({ id: userId }) {
    const result = this.#data.find((v) => v.id === userId);
    if (result) {
      return result;
    }
    return null;
  }
}
class MockCommentRepository {
  #data = [{ id: 1, content: 'test comment' }];
  findOneBy({ id: commentId }) {
    const result = this.#data.find((v) => v.id === commentId);
    if (result) {
      return result;
    }
    return null;
  }
}
class MockReplyRepository {
  #data = [
    { id: 1, userId: 1, commentId: 1, content: 'test reply' },
    { id: 2, userId: 1, commentId: 1, content: 'test reply' },
  ];
  findOneBy({ id: replyId }) {
    return this.#data.find((v) => v.id === replyId);
  }
  save({ userId: userId, commentId: commentId, content: content }) {
    return this.#data.push({
      id: 3,
      userId: userId,
      commentId: commentId,
      content: content,
    });
  }
  update(replyId, { content: content }) {
    const result = this.#data.find((v) => v.id === replyId);
    result.content = content;
    return result;
  }
  softDelete({ id: replyId }) {
    const result = this.#data.filter((v) => v.id !== replyId);
    return result;
  }
}

describe('ReplyService', () => {
  let service: ReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReplyService,
        { provide: getRepositoryToken(Reply), useClass: MockReplyRepository },
        { provide: getRepositoryToken(User), useClass: MockUserRepository },
        {
          provide: getRepositoryToken(Comment),
          useClass: MockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<ReplyService>(ReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createReply는 새로운 대댓글을 생성해야 함', () => {
    const userId = 1;
    const commentId = 1;
    const content = 'test reply 2';
    expect(service.createReply(userId, commentId, content)).resolves.toBe(3);
  });

  it('createReply에 입력하는 userId가 존재하지 않을 경우 에러를 반환해야 함', () => {
    const userId = 10;
    const commentId = 1;
    const content = 'test reply';
    expect(service.createReply(userId, commentId, content)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('createReply에 입력하는 commentId 존재하지 않을 경우 에러를 반환해야 함', () => {
    const userId = 1;
    const commentId = 10;
    const content = 'test reply';
    expect(service.createReply(userId, commentId, content)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('updateReply는 특정 reply를 업데이트 함', () => {
    const replyId = 1;
    const content = 'updated test reply';
    expect(service.updateReply(replyId, content)).resolves.toStrictEqual({
      id: 1,
      userId: 1,
      commentId: 1,
      content: 'updated test reply',
    });
  });

  it('updateReply는 업데이트하고자 하는 reply 데이터가 없을 경우 에러를 반환함', () => {
    const replyId = 10;
    const content = 'updated test reply';
    expect(service.updateReply(replyId, content)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deleteReply는 특정 reply를 삭제함', () => {
    const replyId = 2;
    expect(service.deleteReply(replyId)).resolves.toStrictEqual([
      { id: 1, userId: 1, commentId: 1, content: 'test reply' },
    ]);
  });

  it('deleteReply는 삭제하고자 하는 reply 데이터가 없을 경우 에러를 반환함', () => {
    const replyId = 10;
    expect(service.deleteReply(replyId)).rejects.toThrow(NotFoundException);
  });
});
