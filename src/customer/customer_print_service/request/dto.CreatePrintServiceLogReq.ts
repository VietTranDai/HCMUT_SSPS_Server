import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreatePrintServiceLogReq {
  @IsString()
  @IsNotEmpty()
  customerId: string; // Customer ID

  @IsString()
  @IsNotEmpty()
  printerId: string; // Printer ID

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  documentIds: string[]; // Array of document IDs
}
