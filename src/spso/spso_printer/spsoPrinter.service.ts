import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrinterStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrinterReq } from './request/dto.createPrinterReq';
import { UpdatePrinterReq } from './request/dto.updatePrinterReq';
import { SearchPrintersReq } from './request/dto.searchPrinterReq';

@Injectable()
export class SPSOPrinterService {
  constructor(private prisma: PrismaService) {}

  /*
        ALL SERVICE FOR GET METHOD
  */
  // Lấy tất cả máy in trong hệ thống
  async getAllPrinters() {
    return await this.prisma.printer.findMany({
      include: { location: true },
    });
  }

  // Lấy thông tin chi tiết máy in theo ID
  async getPrinterDetails(id: string) {
    const printer = await this.prisma.printer.findUnique({
      where: { id },
      include: { location: true },
    });

    if (!printer) {
      throw new BadRequestException(`Printer with ID ${id} not found`);
    }

    return printer;
  }

  /*
    ALL SERVICE FOR POST METHOD
  */

  // Hàm tìm kiếm máy in theo điều kiện
  async searchPrintersByConditions(searchPrintersReq: SearchPrintersReq) {
    try {
      const {
        id,
        brandName,
        model,
        printerStatus,
        isInProgress,
        campusName,
        buildingName,
        roomName,
      } = searchPrintersReq;

      // Xây dựng bộ lọc máy in và vị trí
      const printerFilters: any = {};
      const locationFilters: any = {};

      // Lọc thông tin máy in
      if (id && id.trim() !== '') printerFilters.id = id;
      if (brandName && brandName.trim() !== '')
        printerFilters.brandName = brandName;
      if (model && model.trim() !== '') printerFilters.model = model;
      if (printerStatus) printerFilters.printerStatus = printerStatus;
      if (typeof isInProgress === 'boolean')
        printerFilters.isInProgress = isInProgress;

      // Lọc thông tin vị trí
      if (campusName && campusName.trim() !== '')
        locationFilters.campusName = campusName;
      if (buildingName && buildingName.trim() !== '')
        locationFilters.buildingName = buildingName;
      if (roomName && roomName.trim() !== '')
        locationFilters.roomName = roomName;

      // Truy vấn máy in từ cơ sở dữ liệu
      const printers = await this.prisma.printer.findMany({
        where: {
          AND: [
            printerFilters, // Điều kiện cho máy in
            {
              location: {
                AND: [locationFilters], // Điều kiện cho vị trí
              },
            },
          ],
        },
        include: {
          location: true, // Bao gồm thông tin vị trí
        },
      });

      return printers;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error while searching for printers',
      );
    }
  }

  // Tạo mới một máy in
  async createPrinter(createPrinterReq: CreatePrinterReq) {
    const { brandName, model, shortDescription, printerStatus, locationId } =
      createPrinterReq;

    // Kiểm tra xem locationId có hợp lệ không
    const location = await this.prisma.printerLocation.findUnique({
      where: { id: locationId },
    });
    if (!location) {
      throw new BadRequestException(`Location with ID ${locationId} not found`);
    }

    const isInProgress = false;

    return await this.prisma.printer.create({
      data: {
        brandName,
        model,
        shortDescription,
        printerStatus,
        isInProgress,
        locationId,
      },
      include: { location: true },
    });
  }

  /*
    ALL SERVICE FOR PATCH METHOD
  */
  // Hàm cập nhật thông tin máy in
  async updatePrinterInfo(updatePrinterReq: UpdatePrinterReq) {
    const {
      id,
      brandName,
      model,
      shortDescription,
      printerStatus,
      isInProgress,
      locationId,
    } = updatePrinterReq;

    try {
      // Kiểm tra máy in có tồn tại không
      const printer = await this.prisma.printer.findUnique({ where: { id } });
      if (!printer) {
        throw new BadRequestException(`Printer with ID ${id} not found`);
      }

      // Nếu có locationId, kiểm tra locationId có hợp lệ không
      if (locationId) {
        const location = await this.prisma.printerLocation.findUnique({
          where: { id: locationId },
        });
        if (!location) {
          throw new BadRequestException(
            `Location with ID ${locationId} not found`,
          );
        }
      }

      // Cập nhật máy in
      const updatedPrinter = await this.prisma.printer.update({
        where: { id },
        data: {
          brandName,
          model,
          shortDescription,
          printerStatus,
          isInProgress,
          locationId,
        },
      });

      return updatedPrinter;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error while updating printer information',
      );
    }
  }

  /*
    ALL SERVICE FOR PUT METHOD
  */
  /*
    ALL SERVICE FOR DELETE METHOD
  */

  // Xóa máy in
  async deletePrinter(printerId: string) {
    // Kiểm tra xem máy in có tồn tại không
    const printer = await this.prisma.printer.findUnique({
      where: { id: printerId },
    });
    if (!printer) {
      throw new BadRequestException(`Printer with ID ${printerId} not found`);
    }

    try {
      await this.prisma.printer.delete({ where: { id: printerId } });
      return {
        message: `Printer with ID ${printerId} has been deleted successfully`,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }
}
