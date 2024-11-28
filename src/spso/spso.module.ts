import { Module } from '@nestjs/common';
import { SPSOPrinterModule } from './spso_printer/spsoPrinter.module';
import { SPSODefaultConfigModule } from './spso_default_config/spsoDefaultConfig.module';
import { SPSOPrintServiceModule } from './spso_print_service/spsoPrintService.module';
import { SPSOPrinterLocationModule } from './spso_printer_location/spsoPrinterLocation.module';

@Module({
  imports: [
    SPSOPrinterModule,
    SPSODefaultConfigModule,
    SPSOPrintServiceModule,
    SPSOPrinterLocationModule,
  ],
  controllers: [],
  providers: [],
})
export class SPSOModule {}
