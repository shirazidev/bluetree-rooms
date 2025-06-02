import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Brand } from './brand.entity';
import { BaseEntity } from '../../../common/abstracts/base.entity';


@Entity()
export class ContactInfo extends BaseEntity{
  @Column()
  linkedin: string;
  @Column()
  phone: string;
  @Column()
  telegram: string;
  @Column()
  instagram: string;

  @ManyToOne(() => Brand, brand => brand.contactInfos)
  brand: Brand;
}