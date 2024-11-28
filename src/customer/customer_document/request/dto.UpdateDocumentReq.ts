import {
  IsString,
  IsEnum,
  IsInt,
  IsArray,
  IsOptional,
  IsBase64,
} from 'class-validator';
import { PrintSideType, PageSize } from '@prisma/client';

export class UpdateDocumentReq {
  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsEnum(PrintSideType)
  printSideType?: PrintSideType;

  @IsOptional()
  @IsEnum(PageSize)
  pageSize?: PageSize;

  @IsOptional()
  @IsArray()
  pageToPrint?: number[];

  @IsOptional()
  @IsInt()
  numOfCop?: number;

  @IsOptional()
  @IsBase64()
  fileContent?: string; // Chỉ dùng khi muốn cập nhật fileContent, có thể bỏ nếu không muốn.
}
