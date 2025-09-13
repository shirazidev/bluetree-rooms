import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Brand } from './entities/brand.entity';
import { TeamMember } from './entities/team-member.entity';
import { AboutUs } from './entities/about-us.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { ImageService } from '../image/image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Room, Brand, TeamMember, AboutUs, ContactInfo],
    ),
    AuthModule,
    ImageModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, ImageService],
})
export class RoomsModule {}
