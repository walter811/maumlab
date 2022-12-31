import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getCommentById(id: number) {
    const result = await this.commentRepository.findOneBy({ id: id });
    return result;
  }

  async createComment(
    userId: number,
    boardId: number,
    content: string,
  ): Promise<void> {
    await this.commentRepository.save({
      content: content,
      boardId: boardId,
      userId: userId,
    });
  }

  async updateComment(commentId: number, content: string): Promise<void> {
    const check = await this.getCommentById(commentId);
    if (!check) {
      throw new NotFoundException('Invalid comment ID');
    }
    await this.commentRepository.update(commentId, { content: content });
  }

  async deleteComment(commentId: number) {
    const check = await this.getCommentById(commentId);
    if (!check) {
      throw new NotFoundException('Invalid comment ID');
    }
    await this.commentRepository.softDelete({ id: commentId, deletedAt: null });
  }
}
