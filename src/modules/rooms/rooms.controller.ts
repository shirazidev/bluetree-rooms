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
  Redirect,
  Res,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerProfileStorage } from '../../common/utils/multer.util';
import { Response } from 'express';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('connect-brand')
  async connectBrandToRoomFromAdmin(
    @Body() body: { roomId: string; brandId: string },
    @Res() res: Response,
  ) {
    await this.roomsService.connectBrandToRoom(
      parseInt(body.roomId, 10),
      parseInt(body.brandId, 10),
    );
    res.redirect('/admin');
  }

  @Post(':roomId/disconnect-brand')
  async disconnectBrandFromRoom(
    @Param('roomId') roomId: string,
    @Res() res: Response,
  ) {
    await this.roomsService.disconnectBrandFromRoom(parseInt(roomId, 10));
    res.redirect('/admin');
  }

  @Get('brands/create')
  @Render('create-brand')
  createBrandPage() {
    return {};
  }

  @Get('brands/:id/edit')
  @Render('edit-brand')
  async editBrandPage(@Param('id') id: string) {
    const brand = await this.roomsService.findBrandById(parseInt(id, 10));
    return { brand };
  }

  @Post('brands/:id/update')
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
    @Res() res: Response,
  ) {
    await this.roomsService.updateBrand(
      parseInt(id, 10),
      updateBrandDto,
      files.logo ? files.logo[0] : null,
      files.teamMemberImages || [],
    );
    res.redirect('/admin');
  }

  @Post('brands/:id/delete')
  async deleteBrand(@Param('id') id: string, @Res() res: Response) {
    await this.roomsService.deleteBrand(parseInt(id, 10));
    res.redirect('/admin');
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
    @Res() res: Response,
  ) {
    await this.roomsService.createBrand(
      createBrandDto,
      files.logo ? files.logo[0] : null,
      files.teamMemberImages || [],
    );
    res.redirect('/admin');
  }

  @Patch(':roomId/connect-brand/:brandId')
  async connectBrandToRoom(
    @Param('roomId') roomId: number,
    @Param('brandId') brandId: number,
  ) {
    return this.roomsService.connectBrandToRoom(roomId, brandId);
  }

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto, @Res() res: Response) {
    await this.roomsService.createRoom(createRoomDto);
    res.redirect('/admin');
  }
}
