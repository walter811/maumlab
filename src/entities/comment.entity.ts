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
import { Board } from './board.entity';
import { Reply } from './reply.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'content', length: 500 })
  content: string;

  @Column({ type: 'int', name: 'boardId' })
  boardId: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Reply[];

  @ManyToOne(() => Board, (board) => board.comments, { cascade: true })
  board: Board;

  @ManyToOne(() => User, (user) => user.comments, { cascade: true })
  user: User;
}
