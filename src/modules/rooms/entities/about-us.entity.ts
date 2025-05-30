import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Brand } from './brand.entity';
import { BaseEntity } from '../../../common/abstracts/base.entity';

@Entity()
export class AboutUs extends BaseEntity{
  @Column('text')
  content: string;

  @OneToOne(() => Brand, brand => brand.aboutUs)
  brand: Brand;
}