import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/entities/board.entity';
import { Comment } from 'src/entities/comment.entity';
import { Reply } from 'src/entities/reply.entity';
import { User } from 'src/entities/user.entity';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Board, Comment, Reply])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
