import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Res,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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
    return { brand: room.brand, contactus: room.brand.contactInfos, aboutus: room.brand.aboutUs, members: room.brand.teamMembers };
  }

  @Post('brands')
  @AuthDecorator()
  @UseInterceptors(
    FileInterceptor('logo'),
    FilesInterceptor('teamMemberImages'),
  )
  async createBrand(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() logo: Express.Multer.File,
    @UploadedFiles() teamMemberImages: Express.Multer.File[],
  ) {
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
