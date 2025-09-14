import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Brand } from './entities/brand.entity';
import { TeamMember } from './entities/team-member.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { AboutUs } from './entities/about-us.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ImageService } from '../image/image.service';
import { CreateFullBrandDto } from './dto/create-full-brand.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    private dataSource: DataSource,
    private readonly imageService: ImageService,
  ) {}

  async createFullBrand(createFullBrandDto: CreateFullBrandDto): Promise<Brand> {
    return this.dataSource.transaction(async (manager) => {
      const { name, contactInfos } = createFullBrandDto;
      
      const brand = manager.create(Brand, { name });
      
      if (contactInfos && contactInfos.length > 0) {
        const contactInfoEntities = contactInfos.map((ci) => 
          manager.create(ContactInfo, { ...ci, brand })
        );
        brand.contactInfos = contactInfoEntities;
      }
      
      return manager.save(brand);
    });
  }

  async findBySlugWithBrand(slug: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { slug },
      relations: ['brand', 'brand.teamMembers', 'brand.contactInfos', 'brand.aboutUs'],
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

  async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.dataSource.transaction(async (manager) => {
        const { name } = createBrandDto;
        const brand = manager.create(Brand, { name });
        return manager.save(brand);
    });
  }

  async updateBrand(
    brandId: number,
    updateBrandDto: UpdateBrandDto,
    files: { logo?: Express.Multer.File[]; teamMemberImages?: Express.Multer.File[] },
  ): Promise<Brand> {
    return this.dataSource.transaction(async (manager) => {
      const brand = await manager.findOne(Brand, {
        where: { id: brandId },
        relations: ['teamMembers', 'contactInfos', 'aboutUs'],
      });

      if (!brand) {
        throw new NotFoundException(`Brand with ID ${brandId} not found`);
      }

      // Update basic brand info
      brand.name = updateBrandDto.name;
      brand.website = updateBrandDto.website;

      if (files.logo?.[0]) {
        const logoImage = await this.imageService.create(
          { name: brand.name, alt: `${brand.name} logo` },
          files.logo[0],
        );
        brand.logoUrl = logoImage.data.location;
      }

      // Sync About Us
      if (updateBrandDto.aboutUs) {
          if (brand.aboutUs) {
              manager.merge(AboutUs, brand.aboutUs, updateBrandDto.aboutUs);
          } else {
              const newAboutUs = manager.create(AboutUs, { ...updateBrandDto.aboutUs, brand });
              brand.aboutUs = newAboutUs;
          }
      } 

      // Sync Team Members
      const incomingTeamMembers = updateBrandDto.teamMembers || [];
      const existingTeamMembers = brand.teamMembers || [];
      const teamMemberImages = files.teamMemberImages || [];
      let imageCounter = 0;

      // Delete removed team members
      const membersToDelete = existingTeamMembers.filter(
          (em) => !incomingTeamMembers.some((im) => im.id && em.id === im.id),
      );
      if (membersToDelete.length > 0) {
          await manager.remove(membersToDelete);
      }

      brand.teamMembers = await Promise.all(
          incomingTeamMembers.map(async (tmDto) => {
              if (tmDto.id) {
                  // Update existing member
                  const existingMember = existingTeamMembers.find(em => em.id === tmDto.id);
                  if (!existingMember) return; // Should not happen
                  manager.merge(TeamMember, existingMember, { fullName: tmDto.fullName, title: tmDto.title });
                  return existingMember;
              } else {
                  // Create new member
                  const newMember = manager.create(TeamMember, { ...tmDto, brand });
                  const imageFile = teamMemberImages[imageCounter++];
                  if (imageFile) {
                      const profileImage = await this.imageService.create(
                          { name: newMember.fullName, alt: newMember.fullName },
                           imageFile
                      );
                      newMember.profileImageUrl = profileImage.data.location;
                  }
                  return newMember;
              }
          })
      );
      
       // Sync Contact Infos
       const incomingContactInfos = updateBrandDto.contactInfos || [];
       const existingContactInfos = brand.contactInfos || [];

       const contactsToDelete = existingContactInfos.filter(
         (ec) => !incomingContactInfos.some((ic) => ic.id && ec.id === ic.id),
       );
       if (contactsToDelete.length > 0) {
         await manager.remove(contactsToDelete);
       }

       brand.contactInfos = incomingContactInfos.map((ciDto) => {
         if (ciDto.id) {
           const existingContact = existingContactInfos.find(ec => ec.id === ciDto.id);
           if(existingContact) {
             return manager.merge(ContactInfo, existingContact, ciDto);
            }
         } else {
           return manager.create(ContactInfo, { ...ciDto, brand });
         }
       }).filter(ci => ci);

      return manager.save(brand);
    });
  }

  // ... other methods ...
  async connectBrandToRoom(roomId: number, brandId: number) {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    const brand = await this.brandRepository.findOne({ where: { id: brandId } });
    if (!brand) throw new NotFoundException('Brand not found');
    room.brand = brand;
    await this.roomRepository.save(room);
    return room;
  }

  async disconnectBrandFromRoom(roomId: number) {
    const room = await this.roomRepository.findOne({ where: { id: roomId }, relations: ['brand'] });
    if (!room) throw new NotFoundException('Room not found');
    room.brand = null;
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
    const brand = await this.brandRepository.findOne({ where: {id: brandId}});
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${brandId} not found`);
    }
    await this.brandRepository.remove(brand);
  }

  async deleteRoom(roomId: number): Promise<void> {
    const result = await this.roomRepository.delete(roomId);
    if (result.affected === 0) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
  }
}
