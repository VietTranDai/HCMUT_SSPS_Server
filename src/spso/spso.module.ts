import { Module } from '@nestjs/common';
import { SPSOPrinterModule } from './spso_printer/spsoPrinter.module';
import { SPSODefaultConfigModule } from './spso_default_config/spsoDefaultConfig.module';
import { SPSOPrintServiceModule } from './spso_print_service/spsoPrintService.module';
import { SPSOPrinterLocationModule } from './spso_printer_location/spsoPrinterLocation.module';
import { SPSOReportModule } from './spso_report/spsoReport.module';

@Module({
  imports: [
    SPSOPrinterModule,
    SPSODefaultConfigModule,
    SPSOPrintServiceModule,
    SPSOPrinterLocationModule,
    SPSOReportModule,
  ],
  controllers: [],
  providers: [],
})
export class SPSOModule {}
