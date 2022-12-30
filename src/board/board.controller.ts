import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';
import { BoardService } from './board.service';
import { CreatePostingDto } from './dto/createPosting.request.dto';
import { UpdatePostingDto } from './dto/updatePosting.request.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  async getPosting(@Query() query, @Res() res) {
    const { limit, offset } = query;
    if (!limit || !offset) {
      throw new BadRequestException();
    }
    const list = await this.boardService.getPosting(limit, offset);
    res.status(200).json({ list });
  }

  @Get('search')
  async searchPosting(@Query() query, @Res() res) {
    const { search, limit, offset } = query;
    const result = await this.boardService.searchPosting(search, limit, offset);
    res.status(200).json({ result });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('myposting')
  async getMyPosting(@Request() req, @Query() query, @Res() res) {
    const { userId } = req.user;
    const { limit, offset } = query;
    const result = await this.boardService.getMyPosting(userId, limit, offset);
    res.status(200).json({ result });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPosting(
    @Request() req,
    @Body() data: CreatePostingDto,
    @Res() res,
  ) {
    const { userId } = req.user;
    if (!userId) {
      throw new BadRequestException();
    }
    await this.boardService.createPosting(userId, data);
    res.status(201).json({ message: 'Posting created' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':boardId')
  async updatePosting(
    @Param('boardId') boardId: string,
    @Body() data: UpdatePostingDto,
    @Res() res,
  ) {
    await this.boardService.updatePosting(+boardId, data);
    res.status(200).json({ message: 'Posting updated' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':boardId')
  async deletePosting(@Param('boardId') boardId: string, @Res() res) {
    await this.boardService.deletePosting(+boardId);
    res.status(200).json({ message: 'Posting deleted' });
  }
}
