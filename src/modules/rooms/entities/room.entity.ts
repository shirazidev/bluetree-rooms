import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { BaseEntity } from '../../../common/abstracts/base.entity';

@Entity()
export class Room extends BaseEntity {
  @Column({ unique: true })
  slug: string;

  @Column({nullable: true})
  brandId: number | null;

  @ManyToOne(() => Brand, {nullable: true})
  @JoinColumn({ name: 'brandId' })
  brand: Brand | null;
}
