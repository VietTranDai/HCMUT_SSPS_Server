import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorators';
import { GoogleAuthGuard } from './guard';
import { AUTH_MESSAGES } from 'src/common/message/auth.message';
import { AuthService } from './auth.service';
import { UserRole } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  handleGoogleLogin() {
    // initiate google login flow

    return { msg: 'Google authentication' };
  }

  @Public()
  @Get('google/redirect')
  async redirect(
    @Query('code') code: string,
    @Query('role') role?: UserRole,
    @Query('redirectUrl') redirectUrl?: string,
  ) {
    if (!code) {
      throw new ForbiddenException(AUTH_MESSAGES.AUTHORIZATION_CODE_REQUIRED);
    }

    if (!role) role = UserRole.CUSTOMER;

    // Lấy thông tin người dùng từ Google
    const { email, family_name, given_name, picture } =
      await this.authService.verifyUser(code, redirectUrl);

    console.log('Email', email);
    console.log('Family Name', family_name);
    console.log('Given Name', given_name);
    console.log('Picture', picture);

    // Đảm bảo email thuộc domain hcmut.edu.vn
    const allowedDomain = 'hcmut.edu.vn'; // Domain email được phép đăng nhập
    if (!email.endsWith(allowedDomain)) {
      throw new ForbiddenException(AUTH_MESSAGES.INVALID_DOMAIN);
    }

    const user = await this.authService.validateUserWithRole(
      email,
      family_name,
      given_name,
      picture,
      role,
    );

    const token = await this.authService.signToken(user);

    return {
      msg: 'Success',
      data: {
        token,
        user,
      },
    };
  }
}
