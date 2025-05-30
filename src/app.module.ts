import { Module } from '@nestjs/common';
import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';
import { RoomsModule } from './modules/rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
