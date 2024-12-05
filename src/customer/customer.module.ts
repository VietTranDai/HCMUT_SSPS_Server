import { Module } from '@nestjs/common';
import { CustomerPurchaseModule } from './customer_purchase/customerPurchase.module';
import { CustomerPrintServiceModule } from './customer_print_service/customerPrintService.module';
import { CustomerDocumentModule } from './customer_document/customerDocument.module';
import { CustomerMomoModule } from './customer_momo/customerMomo.module';

@Module({
  imports: [
    CustomerPurchaseModule,
    CustomerPrintServiceModule,
    CustomerDocumentModule,
    CustomerMomoModule,
  ],
  controllers: [],
  providers: [],
})
export class CustomerModule {}
