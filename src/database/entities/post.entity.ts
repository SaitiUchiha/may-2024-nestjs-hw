import {
  JoinColumn,
  ManyToOne,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  title: string;

  @Column('text', { nullable: true })
  body: string;

  @Column('text', { nullable: false, unique: true })
  email: string;

  @Column('text', { nullable: false })
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  userId: string;

  @ManyToOne(() => User, (entity) => entity.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
