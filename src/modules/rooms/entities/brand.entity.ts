import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { TeamMember } from './team-member.entity';
import { ContactInfo } from './contact-info.entity';
import { AboutUs } from './about-us.entity';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { Room } from './room.entity';

@Entity()
export class Brand extends BaseEntity {
  @OneToOne(() => Room, room => room.brand, { onDelete: 'SET NULL' })
  @JoinColumn()
  room: Room;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  logoUrl: string;

  @OneToMany(() => TeamMember, teamMember => teamMember.brand, { cascade: true, onDelete: 'CASCADE' })
  teamMembers: TeamMember[];

  @OneToMany(() => ContactInfo, contactInfo => contactInfo.brand, { cascade: true, onDelete: 'CASCADE' })
  contactInfos: ContactInfo[];

  @OneToOne(() => AboutUs, aboutUs => aboutUs.brand, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  aboutUs: AboutUs;
}
