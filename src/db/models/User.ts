import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    nullable: true,
  })
  public firstName: string;

  @Column({
    nullable: true,
  })
  public lastName: string;

  @Column({ default: false })
  public isActive: boolean;
}
