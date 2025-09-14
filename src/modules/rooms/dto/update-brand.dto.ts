import { Type } from 'class-transformer';
import { IsOptional, IsArray, ValidateNested, IsString, IsNumber } from 'class-validator';

class AboutUsDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

class TeamMemberDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsString()
    fullName: string;

    @IsString()
    title: string;
}

class ContactInfoDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsString()
    type: string;

    @IsString()
    value: string;
}

export class UpdateBrandDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => AboutUsDto)
    aboutUs?: AboutUsDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TeamMemberDto)
    teamMembers?: TeamMemberDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContactInfoDto)
    contactInfos?: ContactInfoDto[];
}
