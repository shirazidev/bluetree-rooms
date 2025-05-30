import { Controller, Get, Post, Body, Patch, Param, Delete, Render } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Get('/room')
  @Render('bluetree')
  getHello(): object {
    return {  };
  }

  @Post()
  create(@Body() createRoomDto: CreateBrandDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
