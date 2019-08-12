import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PasswordManager } from './PasswordManager';
import { SharedColumns } from './SharedColumns';
import { UserRole } from '../../shared/constants';
import { columnTransformer } from '../../shared/helpers/helpers';

@Entity()
export class User extends SharedColumns {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @Column({ default: '' })
  public firstName: string;

  @Column({ default: '' })
  public lastName: string;

  @Column({
    unique: true,
    default: '',
    transformer: columnTransformer,
  })
  public email: string;

  @Column({ default: '' })
  public company: string;

  @Column({
    type: 'text',
    default: 'DEVELOPER',
  })
  public role: UserRole;

  @Column({ default: false })
  public isActive: boolean;

  @Column({ default: '' })
  public requestToken: string;
}
