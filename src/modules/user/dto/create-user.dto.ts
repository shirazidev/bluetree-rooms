import { PartialType, ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  Length,
  IsEnum,
} from 'class-validator';
import { ConfirmedPassword } from 'src/common/decorators/password.decorator';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'نام و نام خانوادگی باید یک رشته باشد.' })
  fullName: string;

  @ApiProperty()
  @IsString({ message: 'نام کاربری باید یک رشته باشد.' })
  @IsNotEmpty({ message: 'وارد کردن نام کاربری الزامی است.' })
  username: string;

  @ApiProperty()
  @IsString({ message: 'رمز عبور باید یک رشته باشد.' })
  @Length(8, 20, { message: 'رمز عبور باید بین ۸ تا ۲۰ کاراکتر باشد.' })
  password: string;

  @ApiProperty()
  @ConfirmedPassword('password')
  confirm_password: string;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {}
