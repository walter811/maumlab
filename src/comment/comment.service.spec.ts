import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from '../entities/board.entity';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { CommentService } from './comment.service';

class MockUserRepository {
  #data = [{ id: 1, email: 'walter811@naver.com' }];
  findOneBy({ id: userId }) {
    const result = this.#data.find((v) => v.id === userId);
    if (result) {
      return result;
    }
    return null;
  }
}
class MockBoardRepository {
  #data = [{ id: 1, title: 'test title', content: 'test content' }];
  findOneBy({ id: boardId }) {
    const result = this.#data.find((v) => v.id === boardId);
    if (result) {
      return result;
    }
    return null;
  }
}
class MockCommentRepository {
  #data = [{ id: 1, content: 'test comment', boardId: 1, userId: 1 }];
  findOneBy({ id: commentId }) {
    const result = this.#data.find((v) => v.id === commentId);
    if (result) {
      return result;
    }
    return null;
  }
  save({ content: content, boardId: boardId, userId: userId }) {
    this.#data.push({
      id: 2,
      content: content,
      boardId: boardId,
      userId: userId,
    });
    return this.#data;
  }
  update(commentId, { content: content }) {
    const result = this.#data.find((v) => v.id === commentId);
    result.content = content;
    return result;
  }
  softDelete({ id: commentId }) {
    const result = this.#data.filter((v) => v.id !== commentId);
    return result;
  }
}

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: getRepositoryToken(User), useClass: MockUserRepository },
        {
          provide: getRepositoryToken(Comment),
          useClass: MockCommentRepository,
        },
        { provide: getRepositoryToken(Board), useClass: MockBoardRepository },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createComment??? ????????? ????????? ???????????? ???', () => {
    const content = 'new test comment';
    const boardId = 1;
    const userId = 1;
    expect(
      service.createComment(userId, boardId, content),
    ).resolves.toStrictEqual([
      { id: 1, content: 'test comment', boardId: 1, userId: 1 },
      { id: 2, content: 'new test comment', boardId: 1, userId: 1 },
    ]);
  });

  it('createComment??? ????????? ???????????? ????????? ????????????????????? ?????? ????????? ?????? ????????? ?????????', () => {
    const content = 'new test comment';
    const boardId = 1;
    const userId = 10;
    expect(service.createComment(userId, boardId, content)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('createComment??? ????????? ??????????????? ?????? ???????????? ????????????????????? ?????? ?????? ????????? ?????????', () => {
    const content = 'new test comment';
    const boardId = 10;
    const userId = 1;
    expect(service.createComment(userId, boardId, content)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('updateComment??? ?????? comment??? ???????????? ???', () => {
    const comentId = 1;
    const content = 'update test comment';
    expect(service.updateComment(comentId, content)).resolves.toStrictEqual({
      id: 1,
      content: 'update test comment',
      boardId: 1,
      userId: 1,
    });
  });

  it('updateCommet??? ????????????????????? ?????? comment??? ????????????????????? ?????? ?????? ????????? ?????????', () => {
    const commentId = 10;
    const content = 'update test comment';
    expect(service.updateComment(commentId, content)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deleteComment??? ?????? comment??? ?????????', () => {
    const commentId = 1;
    expect(service.deleteComment(commentId)).resolves.toStrictEqual([]);
  });

  it('deleteComment??? ??????????????? ?????? comment??? ????????????????????? ?????? ?????? ????????? ?????????', () => {
    const commentId = 10;
    expect(service.deleteComment(commentId)).rejects.toThrow(NotFoundException);
  });
});
