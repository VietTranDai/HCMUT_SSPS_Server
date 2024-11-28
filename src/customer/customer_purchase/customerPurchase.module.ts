import { Module } from '@nestjs/common';
import { CustomerPurchaseController } from './customerPurchase.controller';
import { CustomerPurchaseService } from './customerPurchase.service';

@Module({
  imports: [],
  controllers: [CustomerPurchaseController],
  providers: [CustomerPurchaseService],
})
export class CustomerPurchaseModule {}
