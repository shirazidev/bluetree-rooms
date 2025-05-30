import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { TeamMember } from './team-member.entity';
import { ContactInfo } from './contact-info.entity';
import { AboutUs } from './about-us.entity';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { Room } from './room.entity';

@Entity()
export class Brand extends BaseEntity {
  @OneToOne(() => Room, room => room.brand)
  @JoinColumn()
  room: Room;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @OneToMany(() => TeamMember, teamMember => teamMember.brand)
  teamMembers: TeamMember[];

  @OneToMany(() => ContactInfo, contactInfo => contactInfo.brand)
  contactInfos: ContactInfo[];

  @OneToOne(() => AboutUs, aboutUs => aboutUs.brand)
  @JoinColumn()
  aboutUs: AboutUs;
}