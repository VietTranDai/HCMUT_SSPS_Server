import { IsNotEmpty, IsString } from 'class-validator';

export class GetPurchaseDetailReq {
  @IsString({ message: 'customerId must be a string' })
  @IsNotEmpty({ message: 'customerId is required' })
  customerId: string;

  @IsString({ message: 'purchaseId must be a string' })
  @IsNotEmpty({ message: 'purchaseId is required' })
  purchaseId: string;
}
