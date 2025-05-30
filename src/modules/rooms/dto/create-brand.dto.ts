import { IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamMemberDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  profileImageUrl: string;
}

export class CreateContactInfoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  telegram?: string;
}

export class CreateAboutUsDto {
  @ApiProperty()
  @IsString()
  content: string;
}

export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ type: [CreateTeamMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamMemberDto)
  teamMembers: CreateTeamMemberDto[];

  @ApiProperty({ type: [CreateContactInfoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContactInfoDto)
  contactInfos: CreateContactInfoDto[];

  @ApiProperty({ type: CreateAboutUsDto })
  @ValidateNested()
  @Type(() => CreateAboutUsDto)
  aboutUs: CreateAboutUsDto;
}