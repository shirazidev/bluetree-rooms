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
import { ImageDto } from '../image/dto/create-image.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

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

  async findBrandById(brandId: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
      relations: ['teamMembers', 'contactInfos', 'aboutUs'],
    });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${brandId} not found`);
    }
    return brand;
  }

  async createBrand(
    createBrandDto: CreateBrandDto,
    logo: Express.Multer.File | null,
    teamMemberImages: Express.Multer.File[],
  ): Promise<Brand> {
    return this.dataSource.transaction(async (manager) => {
      const { teamMembers, contactInfos, aboutUs, ...brandData } =
        createBrandDto;

      const brand = manager.create(Brand, brandData);
      if (logo) {
        const imageDto: ImageDto = {
          name: brandData.name,
          alt: brandData.name,
          image: logo.originalname,
        };
        const logoImage = await this.imageService.create(imageDto, logo);
        brand.logoUrl = logoImage.data.location;
      }
      await manager.save(brand);

      const aboutUsEntity = manager.create(AboutUs, { ...aboutUs, brand });
      await manager.save(aboutUsEntity);

      if (teamMembers && teamMembers.length > 0) {
        const teamMemberEntities = await Promise.all(
          teamMembers.map(async (tm, index) => {
            const teamMember = manager.create(TeamMember, { ...tm, brand });
            if (teamMemberImages && teamMemberImages[index]) {
              const imageFile = teamMemberImages[index];
              const imageDto: ImageDto = {
                name: tm.fullName,
                alt: tm.fullName,
                image: imageFile.originalname,
              };
              const profileImage = await this.imageService.create(
                imageDto,
                imageFile,
              );
              teamMember.profileImageUrl = profileImage.data.location;
            }
            return manager.save(teamMember);
          }),
        );
        brand.teamMembers = teamMemberEntities;
      }

      if (contactInfos && contactInfos.length > 0) {
        const contactInfoEntities = contactInfos.map((ci) =>
          manager.create(ContactInfo, { ...ci, brand }),
        );
        await manager.save(contactInfoEntities);
        brand.contactInfos = contactInfoEntities;
      }

      brand.aboutUs = aboutUsEntity;

      return brand;
    });
  }

  async updateBrand(
    brandId: number,
    updateBrandDto: UpdateBrandDto,
    logo: Express.Multer.File | null,
    teamMemberImages: Express.Multer.File[],
  ): Promise<Brand> {
    return this.dataSource.transaction(async (manager) => {
      const brand = await manager.findOne(Brand, { where: { id: brandId } });
      if (!brand) {
        throw new NotFoundException(`Brand with ID ${brandId} not found`);
      }

      Object.assign(brand, updateBrandDto.brand);
      if (logo) {
        const imageDto: ImageDto = {
          name: brand.name,
          alt: brand.name,
          image: logo.originalname,
        };
        const logoImage = await this.imageService.create(imageDto, logo);
        brand.logoUrl = logoImage.data.location;
      }
      await manager.save(brand);

      if (updateBrandDto.aboutUs) {
        const aboutUs = await manager.findOne(AboutUs, {
          where: { brand: { id: brandId } },
        });
        if (aboutUs) {
          Object.assign(aboutUs, updateBrandDto.aboutUs);
          await manager.save(aboutUs);
        }
      }

      if (updateBrandDto.teamMembers) {
        await Promise.all(
          updateBrandDto.teamMembers.map(async (tmDto, index) => {
            const teamMember = await manager.findOne(TeamMember, {
              where: { id: tmDto.id },
            });
            if (teamMember) {
              Object.assign(teamMember, tmDto);
              if (teamMemberImages && teamMemberImages[index]) {
                const imageFile = teamMemberImages[index];
                const imageDto: ImageDto = {
                  name: tmDto.fullName,
                  alt: tmDto.fullName,
                  image: imageFile.originalname,
                };
                const profileImage = await this.imageService.create(
                  imageDto,
                  imageFile,
                );
                teamMember.profileImageUrl = profileImage.data.location;
              }
              await manager.save(teamMember);
            }
          }),
        );
      }

      if (updateBrandDto.contactInfos) {
        await Promise.all(
          updateBrandDto.contactInfos.map(async (ciDto) => {
            const contactInfo = await manager.findOne(ContactInfo, {
              where: { id: ciDto.id },
            });
            if (contactInfo) {
              Object.assign(contactInfo, ciDto);
              await manager.save(contactInfo);
            }
          }),
        );
      }

      return this.findBrandById(brandId);
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

  async disconnectBrandFromRoom(roomId: number) {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    room.brandId = null;
    await this.roomRepository.save(room);
    return room;
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async findAllRooms(): Promise<Room[]> {
    return this.roomRepository.find({ relations: ['brand'] });
  }

  async findAllBrands(): Promise<Brand[]> {
    return this.brandRepository.find();
  }

  async deleteBrand(brandId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
        const brand = await manager.findOneBy(Brand, { id: brandId });
        if (!brand) {
            throw new NotFoundException(`Brand with ID ${brandId} not found`);
        }
        await manager.update(Room, { brandId }, { brandId: null });
        await manager.remove(brand);
    });
  }
}
