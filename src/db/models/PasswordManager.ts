import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { SharedColumns } from './SharedColumns';
@Entity()
export class PasswordManager extends SharedColumns {
  @ManyToOne((type) => User, (user) => user.id)
  public userid: User;

  @Column({ default: '' })
  public currentPassword: string;

  @Column({ default: '' })
  public lastPassword: string;

  @Column({ default: false })
  public isActive: boolean;
}
