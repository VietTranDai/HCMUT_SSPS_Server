import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePurchaseLogReq } from './dtos/request/dto.createPurchaseReq';
import { PurchaseStatus } from '@prisma/client';
import { UpdatePurchaseLogStatusReq } from './dtos/request/dto.updatePurchaseStatusReq';

@Injectable()
export class CustomerPurchaseService {
  constructor(private prisma: PrismaService) {}

  /*
    ALL FUNCTION SERVICE FOR GET METHOD
  */

  // Lấy tất cả giao dịch của một khách hàng
  async getPurchasesByCustomerId(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new BadRequestException(`Customer with ID ${customerId} not found`);
    }
    const purchases = await this.prisma.purchaseLog.findMany({
      where: { customerId },
    });
    return purchases;
  }

  // Lấy chi tiết giao dịch theo ID
  async getPurchaseDetails(customerId: string, purchaseId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new BadRequestException(`Customer with ID ${customerId} not found`);
    }

    const purchase = await this.prisma.purchaseLog.findFirst({
      where: { id: purchaseId, customerId },
    });
    if (!purchase) {
      throw new BadRequestException('Purchase with ID ${purchaseId} not found');
    }
    return purchase;
  }

  // Tìm kiếm giao dịch với các điều kiện
  async getPurchasesBaseOnConditions(filters: {
    id?: string;
    customerId?: string;
    startTime?: Date;
    endTime?: Date;
  }) {
    const { id, customerId, startTime, endTime } = filters;

    // Xây dựng điều kiện động
    const whereCondition: any = {};

    if (id && id !== '') {
      const purchase = await this.prisma.purchaseLog.findUnique({
        where: { id: id },
      });
      if (!purchase) {
        throw new BadRequestException(`Purchase with ID ${id} not found`);
      }
      whereCondition.id = id;
    }
    if (customerId && customerId !== '') {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new BadRequestException(
          `Customer with ID ${customerId} not found`,
        );
      }
      whereCondition.customerId = customerId;
    }
    if (startTime || endTime) {
      whereCondition.transactionTime = {};
      if (startTime) {
        whereCondition.transactionTime.gte = startTime; // Lớn hơn hoặc bằng
      }
      if (endTime) {
        whereCondition.transactionTime.lte = endTime; // Nhỏ hơn hoặc bằng
      }
    }

    // Truy vấn database với điều kiện
    const purchases = await this.prisma.purchaseLog.findMany({
      where: whereCondition,
    });

    return purchases;
  }

  /*
    ALL FUNCTION SERVICE FOR POST METHOD
  */

  async createPurchaseLog(createPurchaseLogReq: CreatePurchaseLogReq) {
    const { customerId, orderId, numberOfPage, price, purchaseStatus } =
      createPurchaseLogReq;

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new BadRequestException(`Customer with ID ${customerId} not found`);
    }

    if (purchaseStatus === PurchaseStatus.COMPLETED) {
      await this.prisma.customer.update({
        where: { id: customerId },
        data: {
          currentPage: {
            increment: numberOfPage,
          },
        },
      });
    }

    return this.prisma.purchaseLog.create({
      data: {
        customerId,
        orderId,
        numberOfPage,
        price,
        purchaseStatus,
      },
    });
  }

  /*
    ALL FUNCTION SERVICE FOR PUT METHOD
  */

  async updatePurchaseLogStatus(
    updatePurchaseLogStatusReq: UpdatePurchaseLogStatusReq,
  ) {
    const { purchaseId, customerId, purchaseStatus } =
      updatePurchaseLogStatusReq;

    if (customerId && customerId !== '') {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new BadRequestException(
          `Customer with ID ${customerId} not found`,
        );
      }
    }

    // Find the purchase log
    const purchaseLog = await this.prisma.purchaseLog.findFirst({
      where: {
        id: purchaseId,
        customerId: customerId || undefined,
      },
    });

    if (!purchaseLog) {
      throw new BadRequestException('Purchase log not found');
    }

    // Update number of pages for customer if transitioning to COMPLETED
    if (
      purchaseLog.purchaseStatus === PurchaseStatus.PENDING &&
      purchaseStatus === PurchaseStatus.COMPLETED
    ) {
      await this.prisma.customer.update({
        where: { id: purchaseLog.customerId },
        data: {
          currentPage: {
            increment: purchaseLog.numberOfPage,
          },
        },
      });
    }

    // Update purchase log status
    const updatedLog = await this.prisma.purchaseLog.update({
      where: { id: purchaseLog.id },
      data: { purchaseStatus },
    });

    return updatedLog;
  }

  /*
    ALL FUNCTION SERVICE FOR DELETE METHOD
  */

  async deletePurchaseLogById(purchaseId: string) {
    // Tìm và xóa purchase log theo ID
    const purchaseLog = await this.prisma.purchaseLog.findUnique({
      where: { id: purchaseId },
    });

    if (!purchaseLog) {
      throw new BadRequestException(
        `Purchase log with ID ${purchaseId} not found`,
      );
    }

    await this.prisma.purchaseLog.delete({ where: { id: purchaseId } });

    return purchaseLog;
  }
}
