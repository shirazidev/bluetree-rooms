import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Brand } from './brand.entity';
import { BaseEntity } from '../../../common/abstracts/base.entity';

@Entity()
export class Room extends BaseEntity{

  @Column({ unique: true })
  slug: string;

  @OneToOne(() => Brand, brand => brand.room)
  brand: Brand;
}