import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Brand } from './brand.entity';
import { BaseEntity } from '../../../common/abstracts/base.entity';

@Entity()
export class TeamMember extends BaseEntity{
  @Column()
  fullName: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @ManyToOne(() => Brand, brand => brand.teamMembers)
  brand: Brand;
}
