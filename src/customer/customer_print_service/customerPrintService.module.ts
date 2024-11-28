import { Module } from '@nestjs/common';
import { CustomerPrintServiceController } from './customerPrintService.controller';
import { CustomerPrintServiceService } from './customerPrintService.service';

@Module({
  imports: [],
  controllers: [CustomerPrintServiceController],
  providers: [CustomerPrintServiceService],
})
export class CustomerPrintServiceModule {}
