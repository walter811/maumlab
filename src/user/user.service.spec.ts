import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

class MockUserRepository {
  #data = [
    { id: 1, email: 'walter811@naver.com', password: '1234' },
    { id: 2, email: 'kimss6586@gmail.com', password: '1234' },
  ];
  findOneBy({ email: email }) {
    const data = this.#data.find((v) => v.email === email);
    if (data) {
      return data;
    }
    return null;
  }
  findOne(userId) {
    const data = this.#data.find((v) => v.id === userId);
    if (data) {
      return data;
    }
    return null;
  }
  save(data) {
    const result = this.#data.push({
      id: 3,
      email: data.email,
      password: data.password,
    });
    return result;
  }

  softDelete({ id: userId }) {
    return this.#data.filter((v) => v.id !== userId);
  }
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useClass: MockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUserByEmail은 이메일을 통해 유저를 찾아야 함', () => {
    expect(
      service.getUserByEmail('walter811@naver.com'),
    ).resolves.toStrictEqual({
      id: 1,
      email: 'walter811@naver.com',
      password: '1234',
    });
  });

  it('getUserByEmail은 유저를 찾지 못하면 null을 반환해야함', () => {
    expect(service.getUserByEmail('walter811@gmail.com')).resolves.toBe(null);
  });

  it('createUser는 유저를 생성해야 함', () => {
    const data = {
      email: 'test@gmail.com',
      password: 'test password',
      userName: 'test userName',
      phoneNumber: 'test phoneNumber',
      address: 'test address',
    };
    expect(service.createUser(data)).resolves.toBe(3);
  });

  it('createUser는 이미 같은 이메일을 가진 유저가 있을 때 에러를 반환해야 함', () => {
    const data = {
      email: 'walter811@naver.com',
      password: 'test password',
      userName: 'test userName',
      phoneNumber: 'test phoneNumber',
      address: 'test addres',
    };
    expect(service.createUser(data)).rejects.toThrow(BadRequestException);
  });

  it('updateUser는 업데이트 하고자 하는 유저가 없을 경우 에러를 반환해야 함', () => {
    const email = 'imnotuser@naver.com';
    const data = {
      password: '4321',
      userName: null,
      phoneNumber: null,
      address: null,
    };
    expect(service.updateUser(email, data)).rejects.toThrow(NotFoundException);
  });

  it('deleteUser는 특정 유저를 데이터베이스에서 삭제해야 함', () => {
    const userId = 1;
    expect(service.deleteUser(userId)).resolves.toStrictEqual([
      { id: 2, email: 'kimss6586@gmail.com', password: '1234' },
    ]);
  });

  it('deleteUser는 삭제하고자 하는 유저가 없을 경우 에러를 반환해야 함', () => {
    const userId = 5;
    expect(service.deleteUser(userId)).rejects.toThrow(NotFoundException);
  });
});
