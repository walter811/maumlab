import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Board } from '../entities/board.entity';
import { BoardService } from './board.service';
import { NotFoundException } from '@nestjs/common';

class MockUserRepository {
  #data = [{ id: 1, email: 'walter811@naver.com' }];
  findOneBy({ id: userId }) {
    const result = this.#data.find((v) => v.id === userId);
    return result;
  }
}
class MockBoardRepository {
  #data = [{ id: 1, title: 'test title', content: 'test content' }];
  findOneBy({ id: boardId }) {
    const result = this.#data.find((v) => v.id === boardId);
    return result;
  }
  save(data) {
    const result = this.#data.push({
      id: 2,
      title: data.title,
      content: data.content,
    });
    return result;
  }
  update(boardId, data) {
    const result = this.#data.find((v) => v.id === boardId);
    result.title = data.title;
    return result;
  }
  softDelete({ id: boardId }) {
    const result = this.#data.filter((v) => v.id !== boardId);
    return result;
  }
}

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        { provide: getRepositoryToken(User), useClass: MockUserRepository },
        { provide: getRepositoryToken(Board), useClass: MockBoardRepository },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createPosting은 새로운 게시물을 생성해야 함', () => {
    const userId = 1;
    const data = {
      title: 'test title 2',
      content: 'test content 2',
      userId: 1,
    };
    expect(service.createPosting(userId, data)).resolves.toEqual(2);
  });

  it('createPosting은 데이터베이스에 없는 유저가 게시물을 생성할 시 에러를 반환함', () => {
    const userId = 10;
    const data = {
      title: 'test title 2',
      content: 'test content 2',
      userId: 10,
    };
    expect(service.createPosting(userId, data)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('updatePosting은 특정 게시물을 업데이트함', () => {
    const boardId = 1;
    const data = { title: 'update test title', content: null };
    expect(service.updatePosting(boardId, data)).resolves.toStrictEqual({
      id: 1,
      title: 'update test title',
      content: 'test content',
    });
  });

  it('updatePosting은 업데이트하고자 하는 게시물이 데이터베이스에 없을 경우 에러를 반환함', () => {
    const boardId = 10;
    const data = { title: 'update test title', content: null };
    expect(service.updatePosting(boardId, data)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deletePosting은 특정 게시물을 삭제함', () => {
    const boardId = 1;
    expect(service.deletePosting(boardId)).resolves.toStrictEqual([]);
  });

  it('deletePostng은 삭제하고자 하는 게시물이 데이터베이스에 없을 경우 에러를 반환함', () => {
    const boardId = 10;
    expect(service.deletePosting(boardId)).rejects.toThrow(NotFoundException);
  });
});
