import { Controller, Get, Render } from '@nestjs/common';
import { RoomsService } from '../rooms/rooms.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @Render('admin')
  async root() {
    const rooms = await this.roomsService.findAllRooms();
    const brands = await this.roomsService.findAllBrands();
    return { rooms, brands };
  }
}
