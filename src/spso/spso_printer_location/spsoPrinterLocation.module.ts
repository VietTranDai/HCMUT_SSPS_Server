import { Module } from '@nestjs/common';
import { SPSOPrinterLocationController } from './spsoPrinterLocation.controller';
import { SPSOPrinterLocationService } from './spsoPrinterLocation.service';
@Module({
  imports: [],
  controllers: [SPSOPrinterLocationController],
  providers: [SPSOPrinterLocationService],
})
export class SPSOPrinterLocationModule {}
