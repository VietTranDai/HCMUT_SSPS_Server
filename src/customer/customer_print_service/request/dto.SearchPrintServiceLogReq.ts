import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ServiceStatus } from '@prisma/client';

export class SearchPrintServiceLogReq {
  @IsOptional()
  @IsString()
  customerId?: string; // Customer ID

  @IsOptional()
  @IsString()
  printerId?: string; // Printer ID

  @IsOptional()
  @IsString()
  documentId?: string; // Document ID

  @IsOptional()
  @IsDateString()
  startTime?: string; // Start time for filter

  @IsOptional()
  @IsDateString()
  endTime?: string; // End time for filter

  @IsOptional()
  @IsEnum(ServiceStatus)
  serviceStatus?: ServiceStatus; // Status of the print service (PENDING, IS_PRINTING, COMPLETED, FAILED)
}
