import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':boardId')
  async createComments(
    @Request() req,
    @Param('boardId') boardId: string,
    @Body('content') content: string,
    @Res() res,
  ) {
    const { userId } = req.user;
    if (!boardId || !content) {
      throw new BadRequestException('Invalid input');
    }
    await this.commentService.createComment(userId, +boardId, content);
    res.status(201).json({ message: 'Comment created' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @Res() res,
  ) {
    if (!commentId || content) {
      throw new BadRequestException('Invalid input');
    }
    await this.commentService.updateComment(+commentId, content);
    res.status(200).json({ message: 'Comment updated' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string, @Res() res) {
    if (!commentId) {
      throw new BadRequestException('Invalid input');
    }
    await this.commentService.deleteComment(+commentId);
    res.status(200).json({ message: 'Comment deleted' });
  }
}
