import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { DocumentStatus } from '@prisma/client'; // Sử dụng enum DocumentStatus từ Prisma schema

export class SearchCustomerDocumentReq {
  @IsOptional()
  @IsString()
  customerId?: string; // ID khách hàng

  @IsOptional()
  @IsString()
  id?: string; // ID tài liệu

  @IsOptional()
  @IsDateString()
  startTime?: string; // Thời gian bắt đầu

  @IsOptional()
  @IsDateString()
  endTime?: string; // Thời gian kết thúc

  @IsOptional()
  @IsEnum(DocumentStatus)
  documentStatus?: DocumentStatus; // Trạng thái tài liệu (PENDING, IS_PRINTING, COMPLETED, FAILED)
}
