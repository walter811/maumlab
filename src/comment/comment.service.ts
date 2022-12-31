import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from '../entities/board.entity';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCommentById(id: number) {
    const result = await this.commentRepository.findOneBy({ id: id });
    return result;
  }

  async createComment(
    userId: number,
    boardId: number,
    content: string,
  ): Promise<Comment> {
    const user = this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Invalid user');
    }
    const posting = this.boardRepository.findOneBy({ id: boardId });
    if (!posting) {
      throw new NotFoundException('Invalid posting');
    }
    return await this.commentRepository.save({
      content: content,
      boardId: boardId,
      userId: userId,
    });
  }

  async updateComment(
    commentId: number,
    content: string,
  ): Promise<UpdateResult> {
    const check = await this.getCommentById(commentId);
    if (!check) {
      throw new NotFoundException('Invalid comment ID');
    }
    return await this.commentRepository.update(commentId, { content: content });
  }

  async deleteComment(commentId: number): Promise<UpdateResult> {
    const check = await this.getCommentById(commentId);
    if (!check) {
      throw new NotFoundException('Invalid comment ID');
    }
    return await this.commentRepository.softDelete({
      id: commentId,
      deletedAt: null,
    });
  }
}
