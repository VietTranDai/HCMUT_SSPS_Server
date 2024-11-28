import { Module } from '@nestjs/common';
import { SPSOPrinterController } from './spsoPrinter.controller';
import { SPSOPrinterService } from './spsoPrinter.service';

@Module({
  imports: [],
  controllers: [SPSOPrinterController],
  providers: [SPSOPrinterService],
})
export class SPSOPrinterModule {}
