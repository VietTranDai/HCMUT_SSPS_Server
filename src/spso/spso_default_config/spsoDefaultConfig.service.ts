import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDefaultConfigReq } from './request/dto.createDefaultConfigReq';

@Injectable()
export class SPSODefaultConfigService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả cấu hình mặc định
  async getAllConfigurations() {
    return await this.prisma.defaultConfiguration.findMany({
      include: {
        spso: true, // Bao gồm thông tin liên kết với SPSO
      },
    });
  }

  // Lấy thông tin cấu hình mặc định theo ID
  async getConfigurationById(id: string) {
    const configuration = await this.prisma.defaultConfiguration.findUnique({
      where: { id },
      include: {
        spso: true, // Bao gồm thông tin liên kết với SPSO
      },
    });

    if (!configuration) {
      throw new BadRequestException(
        `Default configuration with ID ${id} not found`,
      );
    }

    return configuration;
  }

  // Hàm lấy cấu hình mới nhất của SPSO
  async getLatestConfiguration() {
    const latestConfig = await this.prisma.defaultConfiguration.findFirst({
      where: {
        isLastConfiguration: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        spso: true, // Bao gồm thông tin của SPSO nếu cần
      },
    });

    if (!latestConfig) {
      throw new BadRequestException(`No latest configuration found`);
    }

    return latestConfig;
  }

  // Tạo mới một cấu hình mặc định
  async createConfiguration(createDefaultConfigReq: CreateDefaultConfigReq) {
    const {
      spsoId,
      defaultPage,
      permittedFileTypes,
      firstTermGivenDate,
      secondTermGivenDate,
      thirdTermGivenDate,
    } = createDefaultConfigReq;

    // Kiểm tra SPSO có tồn tại không
    const spsoExists = await this.prisma.spso.findUnique({
      where: { id: spsoId },
    });
    if (!spsoExists) {
      throw new BadRequestException(`SPSO with ID ${spsoId} not found`);
    }

    // Tìm các cấu hình cũ và đánh dấu không phải là cấu hình mới nhất
    const oldConfigurations = await this.prisma.defaultConfiguration.findMany({
      where: {
        spsoId,
        isLastConfiguration: true,
      },
    });

    if (oldConfigurations.length > 0) {
      await this.prisma.defaultConfiguration.updateMany({
        where: {
          id: {
            in: oldConfigurations.map((config) => config.id),
          },
        },
        data: {
          isLastConfiguration: false,
        },
      });
    }

    // Kiểm tra format đúng first term, second term, third term
    if (
      isNaN(new Date(firstTermGivenDate).getTime()) ||
      isNaN(new Date(secondTermGivenDate).getTime()) ||
      isNaN(new Date(thirdTermGivenDate).getTime())
    ) {
      throw new BadRequestException(`Date format is not correct`);
    }

    // Tạo cấu hình
    return await this.prisma.defaultConfiguration.create({
      data: {
        spsoId,
        defaultPage,
        permittedFileTypes,
        firstTermGivenDate: new Date(firstTermGivenDate),
        secondTermGivenDate: new Date(secondTermGivenDate),
        thirdTermGivenDate: new Date(thirdTermGivenDate),
        isLastConfiguration: true,
      },
    });
  }

  // Xóa cấu hình mặc định
  async deleteConfiguration(id: string) {
    const configuration = await this.prisma.defaultConfiguration.findUnique({
      where: { id },
    });
    if (!configuration) {
      throw new BadRequestException(
        `Default configuration with ID ${id} not found`,
      );
    }

    // Đảm bảo tối thiểu có một cấu hình trong hệ thống
    const totalConfigurations = await this.prisma.defaultConfiguration.count();
    if (totalConfigurations === 1) {
      throw new BadRequestException(
        `Cannot delete the last configuration in the system`,
      );
    }

    // Nếu cấu hình cần xóa là cấu hình mới nhất, chuyển cấu hình mới nhất sang cấu hình cũ
    if (configuration.isLastConfiguration) {
      const latestConfig = await this.prisma.defaultConfiguration.findFirst({
        where: {
          isLastConfiguration: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (latestConfig) {
        await this.prisma.defaultConfiguration.update({
          where: { id: latestConfig.id },
          data: {
            isLastConfiguration: true,
          },
        });
      }
    }

    await this.prisma.defaultConfiguration.delete({ where: { id } });
    return {
      message: `Default configuration with ID ${id} deleted successfully`,
    };
  }
}
