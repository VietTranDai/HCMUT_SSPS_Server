import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchCustomerDocumentReq } from './request/dto.SearchCustomerDocumentReq';
import { CreateDocumentReq } from './request/dto.CreateDocumentReq';
import { DocumentStatus, PageSize } from '@prisma/client';
import { UpdateDocumentReq } from './request/dto.UpdateDocumentReq';

@Injectable()
export class CustomerDocumentService {
  constructor(private prisma: PrismaService) {}

  // Lấy danh sách tài liệu theo ID khách hàng
  async getDocumentsByCustomer(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new BadRequestException(`Customer ID ${customerId} not found`);
    }

    const documents = await this.prisma.document.findMany({
      where: { customerId },
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
        fileContent: false,
      },
    });

    return documents;
  }

  // Tìm kiếm tài liệu theo điều kiện
  async searchDocuments(SearchCustomerDocumentReq: SearchCustomerDocumentReq) {
    const { customerId, id, startTime, endTime, documentStatus } =
      SearchCustomerDocumentReq;

    const filters: any = {};
    if (customerId && customerId.trim() !== '') {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        throw new BadRequestException(`Customer ID ${customerId} not found`);
      }
      filters.customerId = customerId;
    }
    if (id && id.trim() !== '') filters.id = id;
    if (documentStatus) filters.documentStatus = documentStatus;
    if (startTime || endTime) {
      filters.createdAt = {};
      if (startTime) filters.createdAt.gte = new Date(startTime);
      if (endTime) filters.createdAt.lte = new Date(endTime);

      if (filters.createdAt.gte > filters.createdAt.lte) {
        throw new BadRequestException(
          `startTime must be less than or equal to endTime`,
        );
      }

      if (
        isNaN(filters.createdAt.gte.getTime()) ||
        isNaN(filters.createdAt.lte.getTime())
      ) {
        throw new BadRequestException(
          `startTime or endTime is not a valid date`,
        );
      }
    }

    const documents = await this.prisma.document.findMany({
      where: filters,
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
      },
    });

    return documents;
  }

  async getDocumentContent(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
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
      },
    });

    const content = await this.prisma.document.findUnique({
      where: { id },
      select: {
        fileContent: true,
      },
    });

    if (!document) {
      throw new BadRequestException(`Document with ID ${id} not found`);
    }

    return {
      document: document,
      fileContent: content.fileContent,
    };
  }

  async createDocument(createDocumentReq: CreateDocumentReq) {
    const {
      customerId,
      fileName,
      fileType,
      printSideType,
      pageSize,
      pageToPrint,
      numOfCop,
      fileContent,
    } = createDocumentReq;

    const documentStatus = DocumentStatus.PENDING;

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new BadRequestException(`Customer ID ${customerId} not found`);
    }

    const permittedFileTypes = await this.prisma.defaultConfiguration.findFirst(
      {
        where: { isLastConfiguration: true },
        select: { permittedFileTypes: true },
      },
    );

    if (
      !(permittedFileTypes.permittedFileTypes as string[]).includes(fileType)
    ) {
      throw new BadRequestException(`File type ${fileType} is not permitted`);
    }

    // Tính toán `totalCostPage` dựa trên `pageSize`, `pageToPrint`, `numOfCop`
    const totalCostPage =
      (pageSize === PageSize.A4 ? 1 : 2) * pageToPrint.length * numOfCop;

    const document = await this.prisma.document.create({
      data: {
        customerId,
        fileName,
        fileType,
        totalCostPage,
        printSideType,
        pageSize,
        pageToPrint,
        numOfCop,
        documentStatus,
        fileContent: Buffer.from(fileContent, 'base64'), // Chuyển Base64 sang Buffer
      },
    });

    return await this.prisma.document.findUnique({
      where: { id: document.id },
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
    });
  }

  // Hàm cập nhật tài liệu
  async updateDocument(id: string, updateDocumentReq: UpdateDocumentReq) {
    const existingDocument = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      throw new BadRequestException(`Document with id ${id} not found`);
    }

    // Tạo một đối tượng data chứa các trường cần cập nhật
    const updateData: any = {};

    if (updateDocumentReq.fileName) {
      updateData.fileName = updateDocumentReq.fileName;
    }

    if (updateDocumentReq.fileType) {
      const fileType = updateDocumentReq.fileType;
      const permittedFileTypes =
        await this.prisma.defaultConfiguration.findFirst({
          where: { isLastConfiguration: true },
          select: { permittedFileTypes: true },
        });

      if (
        !(permittedFileTypes.permittedFileTypes as string[]).includes(fileType)
      ) {
        throw new BadRequestException(`File type ${fileType} is not permitted`);
      }

      updateData.fileType = updateDocumentReq.fileType;
    }

    if (updateDocumentReq.printSideType) {
      updateData.printSideType = updateDocumentReq.printSideType;
    }

    if (updateDocumentReq.pageSize) {
      updateData.pageSize = updateDocumentReq.pageSize;
      if (Array.isArray(existingDocument.pageToPrint)) {
        updateData.totalCostPage =
          (updateDocumentReq.pageSize === PageSize.A4 ? 1 : 2) *
          existingDocument.pageToPrint.length *
          existingDocument.numOfCop;
      } else {
        throw new BadRequestException('pageToPrint must be an array');
      }
    }

    if (updateDocumentReq.pageToPrint) {
      updateData.pageToPrint = updateDocumentReq.pageToPrint;
      if (PageSize.A4 === existingDocument.pageSize) {
        updateData.totalCostPage =
          1 * updateDocumentReq.pageToPrint.length * existingDocument.numOfCop;
      } else {
        updateData.totalCostPage =
          2 * updateDocumentReq.pageToPrint.length * existingDocument.numOfCop;
      }
    }

    if (updateDocumentReq.numOfCop) {
      updateData.numOfCop = updateDocumentReq.numOfCop;
      if (Array.isArray(existingDocument.pageToPrint)) {
        if (PageSize.A4 === existingDocument.pageSize) {
          updateData.totalCostPage =
            1 *
            existingDocument.pageToPrint.length *
            updateDocumentReq.numOfCop;
        } else {
          updateData.totalCostPage =
            2 *
            existingDocument.pageToPrint.length *
            updateDocumentReq.numOfCop;
        }
      }
    }

    if (updateDocumentReq.fileContent) {
      updateData.fileContent = updateDocumentReq.fileContent;
    }

    // Cập nhật tài liệu với các trường đã được gửi
    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: updateData, // Cập nhật các trường có trong updateData
    });

    return await this.prisma.document.findUnique({
      where: { id: updatedDocument.id },
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
    });
  }
}
