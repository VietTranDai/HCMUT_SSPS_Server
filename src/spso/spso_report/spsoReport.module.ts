import { Module } from '@nestjs/common';
import { SPSOReportService } from './spsoReport.service';
import { SPSOReportController } from './spsoReport.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SPSOReportController],
  providers: [SPSOReportService],
})
export class SPSOReportModule {}
