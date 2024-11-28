import {
  IsNotEmpty,
  IsBoolean,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PrinterStatus } from '@prisma/client';

export class CreatePrinterReq {
  @IsNotEmpty()
  @IsString()
  brandName: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsNotEmpty()
  @IsEnum(PrinterStatus)
  printerStatus: PrinterStatus;

  @IsNotEmpty()
  @IsString()
  locationId: string;
}
