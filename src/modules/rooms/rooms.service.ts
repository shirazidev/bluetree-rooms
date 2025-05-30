import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { DataSource, Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { TeamMember } from './entities/team-member.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { AboutUs } from './entities/about-us.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
    @InjectRepository(AboutUs)
    private aboutUsRepository: Repository<AboutUs>,
    private dataSource: DataSource,
  ) {}
  async findBySlugWithBrand(slug: string) {
    const room = await this.roomRepository.findOne({
      where: { slug },
      relations: [
        'brand',
        'brand.teamMembers',
        'brand.contactInfos',
        'brand.aboutUs',
      ],
    });
    if (!room) {
      throw new NotFoundException(`Room with slug ${slug} not found`);
    }
    return room;
  }

  async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.dataSource.transaction(async (manager) => {
      const { teamMembers, contactInfos, aboutUs, ...brandData } =
        createBrandDto;

      const brand = manager.create(Brand, brandData);
      await manager.save(brand);

      const aboutUsEntity = manager.create(AboutUs, { ...aboutUs, brand });
      await manager.save(aboutUsEntity);

      const teamMemberEntities = teamMembers.map((tm) =>
        manager.create(TeamMember, { ...tm, brand }),
      );
      await manager.save(teamMemberEntities);

      const contactInfoEntities = contactInfos.map((ci) =>
        manager.create(ContactInfo, { ...ci, brand }),
      );
      await manager.save(contactInfoEntities);

      brand.teamMembers = teamMemberEntities;
      brand.contactInfos = contactInfoEntities;
      brand.aboutUs = aboutUsEntity;

      return brand;
    });
  }
  async connectBrandToRoom(roomId: number, brandId: number) {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    room.brandId = brandId;
    await this.roomRepository.save(room);
    return room;
  }
  async createRoom(createRoomDto: CreateRoomDto) {
  const room = this.roomRepository.create(createRoomDto);
  return this.roomRepository.save(room);
}
}
