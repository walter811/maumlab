import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/createUser.request.dto';
import { UpdateUserDto } from './dto/updateUser.request.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createUser(@Body() data: CreateUserDto, @Res() res) {
    await this.userService.createUser(data);
    res.status(201).json({ message: 'User created' });
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async updateUser(@Request() req, @Body() data: UpdateUserDto, @Res() res) {
    const { email } = req.user;
    if (!email) {
      throw new BadRequestException();
    }
    await this.userService.updateUser(email, data);
    res.status(200).json({ message: 'User updated' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteUser(@Request() req, @Res() res) {
    const { userId } = req.user;
    await this.userService.deleteUser(userId);
    res.status(200).json({ message: 'User deleted' });
  }
}
