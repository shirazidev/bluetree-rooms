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
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Get(':slug')
  @Render('bluetree')
  async getRoomBySlug(@Param('slug') slug: string) {
    const room = await this.roomsService.findBySlugWithBrand(slug);
    return { brand: room.brand };
  }
  @Post('/create-brand')
  @AuthDecorator()
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.roomsService.createBrand(createBrandDto);
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
