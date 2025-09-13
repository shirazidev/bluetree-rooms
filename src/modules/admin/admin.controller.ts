import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { RoomsService } from '../rooms/rooms.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Render('admin')
  async root() {
    const rooms = await this.roomsService.findAllRooms();
    const brands = await this.roomsService.findAllBrands();
    return { rooms, brands };
  }
}
