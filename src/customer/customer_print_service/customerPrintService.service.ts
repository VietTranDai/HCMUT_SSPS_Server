import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'queue-typescript';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchPrintServiceLogReq } from './request/dto.SearchPrintServiceLogReq';
import { CreatePrintServiceLogReq } from './request/dto.CreatePrintServiceLogReq';
import { DocumentStatus, PrinterStatus, ServiceStatus } from '@prisma/client';

@Injectable()
export class CustomerPrintServiceService {
  private printerQueue: Map<string, Queue<any>> = new Map();

  constructor(private prisma: PrismaService) {}

  // Get a PrintServiceLog by ID
  async getPrintServiceLogById(id: string) {
    const printServiceLog = await this.prisma.printServiceLog.findUnique({
      where: { id },
      include: {
        customer: true,
        printer: true,
        documents: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            totalCostPage: true,
            printSideType: true,
            pageSize: true,
            pageToPrint: true,
            numOfCop: true,
            documentStatus: true,
            createdAt: true,
          },
        },
      },
    });
    if (!printServiceLog) {
      throw new BadRequestException(`PrintServiceLog with ID ${id} not found`);
    }
    return printServiceLog;
  }

  // Search PrintServiceLogs by conditions (filter)
  async searchPrintServiceLogs(
    searchPrintServiceLogReq: SearchPrintServiceLogReq,
  ) {
    const filterConditions: any = {};

    if (searchPrintServiceLogReq.customerId) {
      filterConditions.customerId = searchPrintServiceLogReq.customerId;

      const customer = await this.prisma.customer.findUnique({
        where: { id: searchPrintServiceLogReq.customerId },
      });

      if (!customer) {
        throw new BadRequestException(
          `Customer ID ${searchPrintServiceLogReq.customerId} not found`,
        );
      }
    }
    if (searchPrintServiceLogReq.printerId) {
      filterConditions.printerId = searchPrintServiceLogReq.printerId;

      const printer = await this.prisma.printer.findUnique({
        where: { id: searchPrintServiceLogReq.printerId },
      });

      if (!printer) {
        throw new BadRequestException(
          `Printer ID ${searchPrintServiceLogReq.printerId} not found`,
        );
      }
    }
    if (searchPrintServiceLogReq.documentId) {
      filterConditions.documentId = searchPrintServiceLogReq.documentId;

      const document = await this.prisma.document.findUnique({
        where: { id: searchPrintServiceLogReq.documentId },
      });

      if (!document) {
        throw new BadRequestException(
          `Document ID ${searchPrintServiceLogReq.documentId} not found`,
        );
      }
    }

    if (
      searchPrintServiceLogReq.startTime &&
      searchPrintServiceLogReq.endTime
    ) {
      // kiểm tra xem startTime và endTime có hợp lệ không
      if (
        new Date(searchPrintServiceLogReq.startTime) >
        new Date(searchPrintServiceLogReq.endTime)
      ) {
        throw new BadRequestException(
          `startTime must be less than or equal to endTime`,
        );
      }

      // kiểm tra format startTime và endTime có hợp lệ không
      if (
        isNaN(new Date(searchPrintServiceLogReq.startTime).getTime()) ||
        isNaN(new Date(searchPrintServiceLogReq.endTime).getTime())
      ) {
        throw new BadRequestException(`Date format is not correct`);
      }

      filterConditions.createdAt = {
        gte: new Date(searchPrintServiceLogReq.startTime),
        lte: new Date(searchPrintServiceLogReq.endTime),
      };
    }
    if (searchPrintServiceLogReq.serviceStatus) {
      filterConditions.serviceStatus = searchPrintServiceLogReq.serviceStatus;
    }

    return await this.prisma.printServiceLog.findMany({
      where: filterConditions,
      include: {
        customer: true,
        printer: true,
        documents: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            totalCostPage: true,
            printSideType: true,
            pageSize: true,
            pageToPrint: true,
            numOfCop: true,
            documentStatus: true,
            createdAt: true,
          },
        },
      },
    });
  }

  // Create print service log for multiple documents
  async createPrintServiceLogs(
    createPrintServiceLogReq: CreatePrintServiceLogReq,
  ) {
    const { documentIds, customerId, printerId } = createPrintServiceLogReq;

    // Kiểm tra danh sách documentIds có trống không
    if (!documentIds || documentIds.length === 0) {
      throw new BadRequestException(
        'At least one document ID must be provided',
      );
    }

    // Kiểm tra customerId có tồn tại không
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new BadRequestException(`Customer ID ${customerId} not found`);
    }

    // Kiểm tra printerId có với trạng thái ENABLE không
    const printer = await this.prisma.printer.findUnique({
      where: { id: printerId },
    });

    if (!printer) {
      throw new BadRequestException(`Printer ID ${printerId} not found`);
    }

    if (printer.printerStatus !== PrinterStatus.ENABLE) {
      throw new BadRequestException(`Printer ID ${printerId} is not enabled`);
    }

    let totalPageCost = 0;

    for (const documentId of documentIds) {
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
      });

      if (!document) {
        throw new BadRequestException(`Document ID ${documentId} not found`);
      }

      totalPageCost += document.totalCostPage;
    }

    let printServiceLog = await this.prisma.printServiceLog.create({
      data: {
        customerId,
        printerId,
        serviceStatus: ServiceStatus.PENDING,
        startTime: new Date(),
        totalPageCost,
      },
    });

    for (const documentId of documentIds) {
      // Tạo các bản ghi PrintServiceLog với trạng thái ban đầu là PENDING
      const cur_document = await this.prisma.document.update({
        where: { id: documentId },
        data: {
          printLogId: printServiceLog.id,
          documentStatus: DocumentStatus.PENDING,
        },
      });
    }

    printServiceLog = await this.prisma.printServiceLog.findUnique({
      where: { id: printServiceLog.id },
      include: {
        customer: true,
        printer: true,
        documents: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            totalCostPage: true,
            printSideType: true,
            pageSize: true,
            pageToPrint: true,
            numOfCop: true,
            documentStatus: true,
            createdAt: true,
          },
        },
      },
    });

    // Kiểm tra trạng thái máy in (isProcessing)
    if (printer.isInProgress) {
      // Nếu máy in đang xử lý, thêm các print logs vào hàng đợi
      if (!this.printerQueue.has(printerId)) {
        this.printerQueue.set(printerId, new Queue());
      }

      this.printerQueue.get(printerId)?.enqueue(printServiceLog);
    } else {
      // Nếu máy in không đang xử lý, bắt đầu xử lý
      await this.prisma.printer.update({
        where: { id: printerId },
        data: { isInProgress: true },
      });

      this.printerQueue.set(printerId, new Queue());
      this.printerQueue.get(printerId)?.enqueue(printServiceLog);

      // Xử lý in cho máy in, đưa vào hàng đợi nếu máy in đang bận
      this.processPrintJob(printerId);
    }

    // Phản hồi ngay lập tức, không đợi quá trình in hoàn tất
    return printServiceLog;
  }

  // Hàm xử lý công việc in cho mỗi máy in
  async processPrintJob(printerId: string) {
    const queue = this.printerQueue.get(printerId);
    if (!queue || queue.length === 0) {
      // Nếu không có công việc nào trong hàng đợi, cập nhật trạng thái máy in và kết thúc
      await this.prisma.printer.update({
        where: { id: printerId },
        data: { isInProgress: false },
      });
      return;
    }

    // Lấy PrintServiceLog từ hàng đợi
    const printServiceLog = queue.dequeue();
    if (printServiceLog) {
      try {
        // Cập nhật trạng thái của PrintServiceLog là IS_PRINTING
        await this.prisma.printServiceLog.update({
          where: { id: printServiceLog.id },
          data: {
            serviceStatus: ServiceStatus.IS_PRINTING,
            startTime: new Date(),
          },
        });

        for (const document of printServiceLog.documents) {
          // Cập nhật trạng thái của tài liệu là IS_PRINTING
          await this.prisma.document.update({
            where: { id: document.id },
            data: { documentStatus: DocumentStatus.IS_PRINTING },
          });

          // Giả sử quá trình in mất 10 giây
          await new Promise((resolve) => setTimeout(resolve, 10000));

          // Sau khi in xong, cập nhật trạng thái PrintServiceLog và tài liệu
          await this.prisma.document.update({
            where: { id: document.id },
            data: { documentStatus: DocumentStatus.COMPLETED },
          });
        }

        // Sau khi in xong, cập nhật trạng thái PrintServiceLog và tài liệu
        await this.prisma.printServiceLog.update({
          where: { id: printServiceLog.id },
          data: { serviceStatus: 'COMPLETED', endTime: new Date() },
        });

        // Tiếp tục xử lý tài liệu tiếp theo trong hàng đợi
        this.processPrintJob(printerId);
      } catch (error) {
        // Nếu có lỗi, cập nhật trạng thái thất bại
        await this.prisma.printServiceLog.update({
          where: { id: printServiceLog.id },
          data: { serviceStatus: 'FAILED', endTime: new Date() },
        });

        // Cập nhật trạng thái tài liệu là thất bại
        await this.prisma.document.updateMany({
          where: { printLogId: printServiceLog.id },
          data: { documentStatus: 'FAILED' },
        });

        // Tiếp tục xử lý tài liệu tiếp theo trong hàng đợi
        this.processPrintJob(printerId);
      }
    }
  }
}
