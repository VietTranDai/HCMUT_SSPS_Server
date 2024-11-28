import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  isString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseStatus } from '@prisma/client';

export class UpdatePurchaseLogStatusReq {
  @ApiProperty({
    description:
      'purchaseId of the purchase log (optional if customerId is provided)',
    example: 'ac908c6e-c9aa-4357-ab98-c51c0d051541',
  })
  @IsString({ message: 'purchaseId must be a string' })
  @IsNotEmpty({ message: 'purchaseId is required' })
  purchaseId: string;

  @ApiProperty({
    description: 'Customer ID (optional if purchase log ID is provided)',
    example: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({
    description: 'New status of the purchase log',
    example: 'COMPLETED',
    enum: PurchaseStatus,
  })
  @IsNotEmpty()
  @IsEnum(PurchaseStatus)
  purchaseStatus: PurchaseStatus;
}
