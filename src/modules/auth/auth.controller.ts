import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/basic.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumesEnum } from 'src/common/enums/swagger-consumes.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  // @AuthDecorator()
  @ApiConsumes(SwaggerConsumesEnum.FORM, SwaggerConsumesEnum.JSON)
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }
  @Post('/login')
  @ApiConsumes(SwaggerConsumesEnum.FORM, SwaggerConsumesEnum.JSON)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
