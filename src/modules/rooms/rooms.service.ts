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
import { ImageService } from '../image/image.service';

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
    private readonly imageService: ImageService,
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

  async createBrand(
    createBrandDto: CreateBrandDto,
    logo: Express.Multer.File,
    teamMemberImages: Express.Multer.File[],
  ): Promise<Brand> {
    return this.dataSource.transaction(async (manager) => {
      const { teamMembers, contactInfos, aboutUs, ...brandData } =
        createBrandDto;

      const brand = manager.create(Brand, brandData);
      if (logo) {
        const logoImage = await this.imageService.create(
          { name: brandData.name, alt: brandData.name },
          logo,
        );
        brand.logoUrl = logoImage.data.location;
      }
      await manager.save(brand);

      const aboutUsEntity = manager.create(AboutUs, { ...aboutUs, brand });
      await manager.save(aboutUsEntity);

      const teamMemberEntities = await Promise.all(
        teamMembers.map(async (tm, index) => {
          const teamMember = manager.create(TeamMember, { ...tm, brand });
          if (teamMemberImages && teamMemberImages[index]) {
            const profileImage = await this.imageService.create(
              { name: tm.fullName, alt: tm.fullName },
              teamMemberImages[index],
            );
            teamMember.profileImageUrl = profileImage.data.location;
          }
          return manager.save(teamMember);
        }),
      );

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
