// src/modules/rooms/dto/create-brand.dto.ts
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateTeamMemberDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}

class CreateContactInfoDto {
  @IsString()
  type: string;

  @IsString()
  value: string;
}

class CreateAboutUsDto {
  @IsString()
  content: string;
}

export class CreateBrandDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamMemberDto)
  @IsArray()
  teamMembers?: CreateTeamMemberDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateContactInfoDto)
  @IsArray()
  contactInfos?: CreateContactInfoDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAboutUsDto)
  aboutUs?: CreateAboutUsDto;
}