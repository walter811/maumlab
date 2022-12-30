import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Comment } from './entities/comment.entity';
import { Reply } from './entities/reply.entity';
import { User } from './entities/user.entity';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { MorganModule } from 'nest-morgan';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    MorganModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.DB_HOST}`,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Board, Comment, Reply],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    BoardModule,
    CommentModule,
  ],
  controllers: [UserController],
})
export class AppModule {}
