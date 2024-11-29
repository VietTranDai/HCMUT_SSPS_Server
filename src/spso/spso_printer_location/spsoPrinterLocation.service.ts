import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrinterLocationReq } from './request/dto.CreatePrinterLocationReq';

@Injectable()
export class SPSOPrinterLocationService {
  constructor(private prisma: PrismaService) {}

  /*
    ALL SERVICE FOR GET METHOD
  */

  async getLocationById(locationId: string) {
    const location = await this.prisma.printerLocation.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new BadRequestException(
        `Printer location with ID ${locationId} not found`,
      );
    }

    return location;
  }

  /*
    ALL SERVICE FOR POST METHOD
  */
  async getLocationsBasedOnConditions(conditions: {
    campusName?: string;
    buildingName?: string;
    roomName?: string;
    printerLocationId?: string;
  }) {
    // Xây dựng điều kiện where động
    const where: any = {};

    if (
      conditions.printerLocationId &&
      conditions.printerLocationId.trim() !== ''
    ) {
      where.id = conditions.printerLocationId;
    } else {
      if (conditions.campusName && conditions.campusName.trim() !== '') {
        where.campusName = conditions.campusName;
      }
      if (conditions.buildingName && conditions.buildingName.trim() !== '') {
        where.buildingName = conditions.buildingName;
      }
      if (conditions.roomName && conditions.roomName.trim() !== '') {
        where.roomName = conditions.roomName;
      }
    }

    // Truy vấn Prisma
    return await this.prisma.printerLocation.findMany({ where });
  }

  async createLocation(createPrinterLocationReq: CreatePrinterLocationReq) {
    const { campusName, buildingName, roomName, description } =
      createPrinterLocationReq;

    if (campusName !== 'CS1' && campusName !== 'CS2') {
      throw new BadRequestException('Campus name must be CS1 or CS2');
    }

    const tempPrinterLocation = await this.prisma.printerLocation.findFirst({
      where: {
        campusName: campusName,
        buildingName: buildingName,
        roomName: roomName,
      },
    });
    if (tempPrinterLocation) {
      throw new BadRequestException('Printer location already exists');
    }

    const campusAdress =
      campusName === 'CS1'
        ? '268 Lý Thường Kiệt, P.14, Q.10, Tp. HCM'
        : 'Khu đô thị Đại học Quốc Gia Tp.HCM, Thủ Đức';

    const hotline =
      campusName === 'CS1' ? '(+84) 28 38652 442' : '(+84) 28 12345 6789';

    return await this.prisma.printerLocation.create({
      data: {
        campusName,
        buildingName,
        roomName,
        campusAdress,
        hotline,
        description,
      },
    });
  }

  /*
    ALL SERVICE FOR PUT METHOD
  */

  /*
    ALL SERVICE FOR DELETE METHOD
  */

  async deleteLocation(id: string): Promise<void> {
    const existingLocation = await this.prisma.printerLocation.findUnique({
      where: { id },
    });
    if (!existingLocation) {
      throw new BadRequestException('Printer location not found');
    }
    await this.prisma.printerLocation.delete({
      where: { id },
    });
  }
}
