import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PasswordManager } from './PasswordManager';
import { SharedColumns } from './SharedColumns';
import { UserRole } from '../../shared/constants';
import { columnTransformer } from '../../shared/helpers/helpers';

@Entity()
export class User extends SharedColumns {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany((type) => PasswordManager, (password) => password.userid)
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

  @Column({
    type: 'text',
    default: 'DEVELOPER',
  })
  public role: UserRole;

  @Column({ default: false })
  public isActive: boolean;
}
