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
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerProfileStorage } from '../../common/utils/multer.util';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateFullBrandDto } from './dto/create-full-brand.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('brands/create-full')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([])) // Use interceptor for multipart/form-data
  async createFullBrand(@Body() createFullBrandDto: CreateFullBrandDto) {
    return this.roomsService.createFullBrand(createFullBrandDto);
  }

  @Post('connect-brand')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async connectBrandToRoomFromAdmin(
    @Body() body: { roomId: string; brandId: string },
  ) {
    return this.roomsService.connectBrandToRoom(
      parseInt(body.roomId, 10),
      parseInt(body.brandId, 10),
    );
  }

  @Post(':roomId/disconnect-brand')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async disconnectBrandFromRoom(@Param('roomId') roomId: string) {
    return this.roomsService.disconnectBrandFromRoom(parseInt(roomId, 10));
  }

  @Get('brands/:id/edit')
  @UseGuards(AuthGuard)
  @Render('edit-brand')
  async editBrandPage(@Param('id') id: string) {
    const brand = await this.roomsService.findBrandById(parseInt(id, 10));
    return { brand };
  }

  @Post('brands/:id/update')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
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
  async updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; teamMemberImages?: Express.Multer.File[] },
  ) {
    return this.roomsService.updateBrand(parseInt(id, 10), updateBrandDto, files);
  }

  @Delete('brands/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteBrand(@Param('id') id: string) {
    await this.roomsService.deleteBrand(parseInt(id, 10));
    return { message: 'Brand deleted successfully' };
  }

  @Get(':slug')
  @Render('bluetree')
  async getRoomBySlug(@Param('slug') slug: string) {
    const room = await this.roomsService.findBySlugWithBrand(slug);
    if (!room.brand) {
      return {
        brand: null,
        contactus: [],
        aboutus: null,
        members: [],
      };
    }
    return {
      brand: room.brand,
      contactus: room.brand.contactInfos,
      aboutus: room.brand.aboutUs,
      members: room.brand.teamMembers,
    };
  }

  @Post('brands')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.roomsService.createBrand(createBrandDto);
  }

  @Patch(':roomId/connect-brand/:brandId')
  @UseGuards(AuthGuard)
  async connectBrandToRoom(
    @Param('roomId') roomId: number,
    @Param('brandId') brandId: number,
  ) {
    return this.roomsService.connectBrandToRoom(roomId, brandId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteRoom(@Param('id') id: string) {
    await this.roomsService.deleteRoom(parseInt(id, 10));
    return { message: 'Room deleted successfully' };
  }
}
