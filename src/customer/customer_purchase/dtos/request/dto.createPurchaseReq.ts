import { PurchaseStatus } from '@prisma/client';
import {
  IsString,
  IsInt,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreatePurchaseLogReq {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'numberOfPage must be a positive integer' }) // Đảm bảo số trang phải dương
  numberOfPage: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'price must be a positive number greater than 0' }) // Đảm bảo giá phải dương
  price: number;

  @IsEnum(PurchaseStatus)
  @IsNotEmpty()
  purchaseStatus: PurchaseStatus;
}
