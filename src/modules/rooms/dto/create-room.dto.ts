import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  slug: string;
  @ApiPropertyOptional()
  brandId: number;
}
