import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { USERS_MESSAGE } from 'src/common/message/user.message';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // CREATE SERVICE
  async createUser(
    email: string,
    familyName: string,
    givenName: string,
    picture: string,
    role: UserRole,
  ) {
    return await this.prisma.user.create({
      data: {
        email: email,
        role: role,
        familyName: familyName,
        givenName: givenName,
        avatar: picture,
        customer: {
          create: {
            currentPage: 0,
          },
        },
      },
    });
  }

  // GET SERVICE
  async getUserByID(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    return user ? user : null;
  }

  async getUserIDByEmail(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user ? user.id : null;
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });

    //Activate when being deleted while Online
    if (!user) throw new NotFoundException(USERS_MESSAGE.ID_NOT_FOUND);
    return user;
  }

  // UPDATE SERVICE
  async updateNameForNewUser(
    id: string,
    email: string,
    familyName: string,
    givenName: string,
    picture: string,
  ) {
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        familyName: familyName,
        givenName: givenName,
        avatar: picture,
      },
    });
  }

  // DELETE SERVICE
}
