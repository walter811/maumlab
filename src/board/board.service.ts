import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/entities/board.entity';
import { User } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreatePostingDto } from './dto/createPosting.request.dto';
import { UpdatePostingDto } from './dto/updatePosting.request.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getPosting(limit: number, offset: number): Promise<any> {
    const result = await this.boardRepository
      .createQueryBuilder('board')
      .select()
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.comments', 'comment')
      .leftJoinAndSelect('comment.replies', 'reply')
      .limit(limit)
      .offset(offset)
      .orderBy('board.createdAt', 'DESC')
      .getMany();

    return result;
  }

  async searchPosting(
    search: number,
    limit: number,
    offset: number,
  ): Promise<any> {
    const result = await this.boardRepository
      .createQueryBuilder('board')
      .select()
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.comments', 'comment')
      .leftJoinAndSelect('comment.replies', 'reply')
      .where({ title: Like(`%${search}%`) })
      .limit(limit)
      .offset(offset)
      .orderBy('board.createdAt', 'DESC')
      .getMany();

    return result;
  }

  async getMyPosting(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<any> {
    const result = await this.boardRepository
      .createQueryBuilder('board')
      .select()
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.comments', 'comment')
      .leftJoinAndSelect('comment.replies', 'reply')
      .where({ userId: userId })
      .limit(limit)
      .offset(offset)
      .orderBy('board.createdAt', 'DESC')
      .getMany();

    return result;
  }

  async createPosting(userId: number, data: CreatePostingDto): Promise<void> {
    const check = this.userRepository.findOneBy({ id: userId });
    if (!check) {
      throw new NotFoundException();
    }
    await this.boardRepository.save({
      title: data.title,
      content: data.content,
      userId: userId,
    });
  }

  async updatePosting(boardId: number, data: UpdatePostingDto): Promise<void> {
    const check = this.boardRepository.findOneBy({ id: boardId });
    if (!check) {
      throw new NotFoundException('Invalid Posting');
    }
    if (data.title) {
      await this.boardRepository.update(boardId, { title: data.title });
    }
    if (data.content) {
      await this.boardRepository.update(boardId, { content: data.content });
    }
  }

  async deletePosting(boardId: number): Promise<void> {
    const check = this.boardRepository.findOneBy({ id: boardId });
    if (!check) {
      throw new NotFoundException('Invalid Posting');
    }
    await this.boardRepository.softDelete({ id: boardId, deletedAt: null });
  }
}
