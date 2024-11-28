import { Module } from '@nestjs/common';
import { SPSOPrintServiceController } from './spsoPrintService.controller';
import { SPSOPrintServiceService } from './spsoPrintService.service';

@Module({
  imports: [],
  controllers: [SPSOPrintServiceController],
  providers: [SPSOPrintServiceService],
})
export class SPSOPrintServiceModule {}
