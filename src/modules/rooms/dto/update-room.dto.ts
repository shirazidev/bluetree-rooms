import { PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateRoomDto extends PartialType(CreateBrandDto) {}
