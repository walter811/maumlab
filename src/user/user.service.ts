import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.request.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUser(): Promise<any> {
    const result = await this.userRepository.find();
    return result;
  }

  async getUserByEmail(email: string): Promise<any> {
    const result = await this.userRepository.findOneBy({ email: email });
    return result;
  }

  async createUser(data: CreateUserDto): Promise<void> {
    const user = await this.getUserByEmail(data.email);
    if (user) {
      throw new HttpException('Duplicate user', 400);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.userRepository.save({
      email: data.email,
      password: hashedPassword,
      userName: data.userName,
      phoneNumber: data.phoneNumber,
      address: data.address,
    });
  }

  async updateUser(email: string, data: UpdateUserDto): Promise<any> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await this.userRepository.update(user.id, { password: hashedPassword });
    }
    if (data.userName) {
      await this.userRepository.update(user.id, { userName: data.userName });
    }
    if (data.phoneNumber) {
      await this.userRepository.update(user.id, {
        phoneNumber: data.phoneNumber,
      });
    }
    if (data.address) {
      await this.userRepository.update(user.id, { address: data.address });
    }
  }

  async deleteUser(userId): Promise<any> {
    const user = this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    await this.userRepository.softDelete({ id: userId, deletedAt: null });
  }
}
