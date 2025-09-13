import { Module, Global } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerProfileStorage } from '../../common/utils/multer.util';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    MulterModule.register({
      storage: multerProfileStorage('images'),
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
