import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/createUser.request.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const result = await this.userRepository.findOneBy({ email: email });
    return result;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const user = await this.getUserByEmail(data.email);
    if (user) {
      throw new BadRequestException('Duplicate user');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.userRepository.save({
      email: data.email,
      password: hashedPassword,
      userName: data.userName,
      phoneNumber: data.phoneNumber,
      address: data.address,
    });
  }

  async updateUser(email: string, data: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return await this.userRepository.update(user.id, {
        password: hashedPassword,
      });
    }
    if (data.userName) {
      return await this.userRepository.update(user.id, {
        userName: data.userName,
      });
    }
    if (data.phoneNumber) {
      return await this.userRepository.update(user.id, {
        phoneNumber: data.phoneNumber,
      });
    }
    if (data.address) {
      return await this.userRepository.update(user.id, {
        address: data.address,
      });
    }
  }

  async deleteUser(userId): Promise<UpdateResult> {
    const user = this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.userRepository.softDelete({
      id: userId,
      deletedAt: null,
    });
  }
}
