import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class SharedColumns {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: string;
}
