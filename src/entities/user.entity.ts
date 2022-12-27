import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'string', name: 'email' })
  email: string;

  @Column({ type: 'string', name: 'password' })
  password: string;

  @Column({ type: 'string', name: 'userName' })
  userName: string;

  @Column({ type: 'string', name: 'phoneNumber' })
  phoneNumber: string;

  @Column({ type: 'string', name: 'address' })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
