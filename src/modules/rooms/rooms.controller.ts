import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Render,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerProfileStorage } from '../../common/utils/multer.util';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('brands/create')
  @Render('create-brand')
  createBrandPage() {
    return {};
  }

  @Get(':slug')
  @Render('bluetree')
  async getRoomBySlug(@Param('slug') slug: string) {
    const room = await this.roomsService.findBySlugWithBrand(slug);
    return {
      brand: room.brand,
      contactus: room.brand.contactInfos,
      aboutus: room.brand.aboutUs,
      members: room.brand.teamMembers,
    };
  }

  @Post('brands')
  // @AuthDecorator()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'teamMemberImages', maxCount: 10 },
      ],
      {
        storage: multerProfileStorage('brands'),
      },
    ),
  )
  async createBrand(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; teamMemberImages?: Express.Multer.File[] },
  ) {
    const logo = files.logo ? files.logo[0] : null;
    const teamMemberImages = files.teamMemberImages || [];
    return this.roomsService.createBrand(createBrandDto, logo, teamMemberImages);
  }

  @Patch(':roomId/connect-brand/:brandId')
  @AuthDecorator()
  async connectBrandToRoom(
    @Param('roomId') roomId: number,
    @Param('brandId') brandId: number,
  ) {
    return this.roomsService.connectBrandToRoom(roomId, brandId);
  }

  @Post('create')
  @AuthDecorator()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }
}
