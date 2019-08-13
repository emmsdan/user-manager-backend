import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { SharedColumns } from './SharedColumns';
import bcrypt from 'bcrypt';
import { getEnv } from '../../shared/helpers/helpers';
@Entity()
export class PasswordManager extends SharedColumns {
  @PrimaryColumn({
    type: 'uuid',
    unique: true,
  })
  @ManyToOne((type) => User, (user) => user.id)
  public id: number;

  @Column()
  public currentPassword: string;

  @Column({ default: '' })
  public lastPassword: string;
}
