import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerMomoService {
  constructor(private prisma: PrismaService) {}
}
