import { PrinterStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsEnum,
} from 'class-validator';

export class SearchPrintersReq {
  @IsOptional()
  @IsString()
  id: string; // ID của máy in (bắt buộc)

  @IsOptional()
  @IsString()
  brandName?: string; // Tên hãng máy in (có thể không thay đổi)

  @IsOptional()
  @IsString()
  model?: string; // Tên dòng máy in (có thể không thay đổi)

  @IsOptional()
  @IsEnum(PrinterStatus)
  printerStatus?: PrinterStatus; // Trạng thái máy in (có thể không thay đổi)

  @IsOptional()
  @IsBoolean()
  isInProgress?: boolean; // Máy in đang sử dụng (có thể không thay đổi)

  @IsOptional()
  @IsString()
  campusName?: string; // Tên campus (có thể không thay đổi)

  @IsOptional()
  @IsString()
  buildingName?: string; // Tên tòa nhà (có thể không thay đổi)

  @IsOptional()
  @IsString()
  roomName?: string; // Tên phòng (có thể không thay đổi)
}
