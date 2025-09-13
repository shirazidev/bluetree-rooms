import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  controllers: [AdminController],
})
export class AdminModule {}
