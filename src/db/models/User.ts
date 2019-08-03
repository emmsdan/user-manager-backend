import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @Column({
    nullable: true,
  })
  public firstName: string;

  @Column({
    nullable: true,
  })
  public lastName: string;

  @Column({ unique: true })
  public email: string;

  @Column({ default: false })
  public isActive: boolean;
}
