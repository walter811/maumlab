import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Reply } from '../entities/reply.entity';
import { User } from '../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createReply(
    userId: number,
    commentId: number,
    content: string,
  ): Promise<Reply> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Invalid user');
    }
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException('Invalid comment');
    }
    return await this.replyRepository.save({
      userId: userId,
      commentId: commentId,
      content: content,
    });
  }

  async updateReply(replyId: number, content: string): Promise<UpdateResult> {
    const reply = await this.replyRepository.findOneBy({ id: replyId });
    if (!reply) {
      throw new NotFoundException('Invalid reply');
    }
    return await this.replyRepository.update(replyId, { content: content });
  }

  async deleteReply(replyId: number): Promise<UpdateResult> {
    const reply = await this.replyRepository.findOneBy({ id: replyId });
    if (!reply) {
      throw new NotFoundException('Invalid reply');
    }
    return await this.replyRepository.softDelete({
      id: replyId,
      deletedAt: null,
    });
  }
}
