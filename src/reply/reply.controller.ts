import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReplyService } from './reply.service';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':commentId')
  async createReply(
    @Request() req,
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @Res() res,
  ) {
    const { userId } = req.user;
    if (!userId || commentId || content) {
      throw new BadRequestException('Invalid input');
    }
    await this.replyService.createReply(userId, +commentId, content);
    res.status(201).json({ message: 'Reply created' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':replyId')
  async updateReply(
    @Param('replyId') replyId: string,
    @Body('content') content: string,
    @Res() res,
  ) {
    if (!replyId || content) {
      throw new BadRequestException('Invalid input');
    }
    await this.replyService.updateReply(+replyId, content);
    res.status(200).json({ message: 'Reply updated' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':replyId')
  async deleteReply(@Param('replyId') replyId: string, @Res() res) {
    if (!replyId) {
      throw new BadRequestException('Invalid input');
    }
    await this.replyService.deleteReply(+replyId);
    res.status(200).json({ message: 'Reply deleted' });
  }
}
