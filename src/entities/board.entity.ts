import { type } from 'os';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from './user.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'title', length: 50 })
  title: string;

  @Column({ type: 'varchar', name: 'content', length: 2200 })
  content: string;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.boards, { cascade: true })
  user: User;
}
