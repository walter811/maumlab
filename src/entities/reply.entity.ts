import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'content' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.replies, { cascade: true })
  user: User;
  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @ManyToOne(() => Comment, (comment) => comment.replies, { cascade: true })
  comment: Comment;
  @Column({ type: 'int', name: 'commentId' })
  commentId: number;
}
