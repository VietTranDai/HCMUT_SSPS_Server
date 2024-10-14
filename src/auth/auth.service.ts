import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AUTH_MESSAGES } from 'src/common/message/auth.message';
import { User, UserRole } from '@prisma/client';
import { JwtPayLoad } from 'src/common/model/jwt-payload.interface';

@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    console.log(
      config.get('GOOGLE_CLIENT_ID'),
      config.get('GOOGLE_CLIENT_SECRET'),
      config.get('GOOGLE_REDIRECT_URI'),
    );
    this.oauth2Client = new OAuth2Client(
      config.get('GOOGLE_CLIENT_ID'),
      config.get('GOOGLE_CLIENT_SECRET'),
      config.get('GOOGLE_REDIRECT_URI'),
    );
  }

  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
    });
  }

  async verifyUser(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);

      const options = {
        idToken: tokens.id_token,
        audience: this.config.get('GOOGLE_CLIENT_ID'),
      };

      const ticket = await this.oauth2Client.verifyIdToken(options);

      const { email, family_name, given_name, picture } = ticket.getPayload();
      return { email, family_name, given_name, picture };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(AUTH_MESSAGES.INVALID_CODE);
    }
  }

  async validateUser(
    email: string,
    family_name: string,
    given_name: string,
    picture: string,
  ) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);

    if (user.familyName === '' || user.givenName === '') {
      this.userService.updateNameForNewUser(
        user.id,
        email,
        family_name,
        given_name,
        picture,
      );
    }

    return user;
  }

  async validateUserWithRole(
    email: string,
    family_name: string,
    given_name: string,
    picture: string,
    role: UserRole,
  ) {
    let user = await this.prisma.user.findFirst({
      where: { email: email, role: role },
    });

    if (!user) {
      if (role != UserRole.CUSTOMER) {
        throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
      } else {
        await this.userService.createUser(
          email,
          family_name,
          given_name,
          picture,
          role,
        );
      }
    }

    user = await this.prisma.user.findFirst({
      where: { email: email, role: role },
    });

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (
      user.familyName === '' ||
      user.givenName === '' ||
      user.avatar === null ||
      user.avatar === ''
    ) {
      this.userService.updateNameForNewUser(
        user.id,
        email,
        family_name,
        given_name,
        picture,
      );
    }

    return user;
  }

  async signToken(user: User) {
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    } as JwtPayLoad;

    return this.jwtService.signAsync(tokenPayload, {
      secret: this.config.get<string>('jwt_secret'),
      expiresIn: '1h',
    });
  }
}
