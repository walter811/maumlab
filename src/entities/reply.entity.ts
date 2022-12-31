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

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column({ type: 'int', name: 'commentId' })
  commentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.replies, { cascade: true })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, { cascade: true })
  comment: Comment;
}
