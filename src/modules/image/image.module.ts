import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, multerStorage } from '../../common/utils/multer.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    MulterModule.register({
      storage: diskStorage(multerStorage('images')),
      fileFilter: imageFileFilter,
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
