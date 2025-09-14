import { Entity, Column, ManyToOne } from 'typeorm';
import { Brand } from './brand.entity';
import { BaseEntity } from '../../../common/abstracts/base.entity';

@Entity()
export class ContactInfo extends BaseEntity {
  @Column()
  type: string;

  @Column()
  value: string;

  @ManyToOne(() => Brand, brand => brand.contactInfos)
  brand: Brand;
}
