import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsInt,
  IsArray,
  IsBase64,
} from 'class-validator';
import { PrintSideType, PageSize } from '@prisma/client';

export class CreateDocumentReq {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsNotEmpty()
  @IsEnum(PrintSideType)
  printSideType: PrintSideType;

  @IsNotEmpty()
  @IsEnum(PageSize)
  pageSize: PageSize;

  @IsNotEmpty()
  @IsArray()
  pageToPrint: number[];

  @IsNotEmpty()
  @IsInt()
  numOfCop: number;

  @IsNotEmpty()
  @IsBase64()
  fileContent: string;
}
