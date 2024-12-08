import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorators';
import { SPSOReportService } from './spsoReport.service';
import { Response } from 'express';

@Public()
// @ApiBearerAuth()
@ApiTags('SPSO Printer Periodic Report')
@Controller('spso/periodic-report')
export class SPSOReportController {
  constructor(private readonly spsoReportService: SPSOReportService) {}

  @Get(':id/get_file')
  @ApiOperation({ summary: 'Download periodic report as Base64' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the Base64 encoded PDF content of the periodic report.',
  })
  @ApiResponse({
    status: 400,
    description: 'Report not found.',
  })
  async get_file(@Param('id') id: string) {
    console.log('checking id', id);
    try {
      const base64Content =
        await this.spsoReportService.getReportContentAsBase64(id);
      return {
        statusCode: 200,
        message: 'Report retrieved successfully',
        data: base64Content,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  @Get(':id/download')
  async downloadReport(@Param('id') id: string, @Res() res: Response) {
    const report = await this.spsoReportService.getReportById(id);

    if (!report) {
      return res.status(HttpStatus.NOT_FOUND).send('Report not found');
    }

    // Thiết lập header và trả nội dung
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${report.title}.pdf"`,
    });

    res.send(Buffer.from(report.reportContent));
  }

  @Get('get-all')
  @ApiOperation({ summary: 'Get all periodic reports' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all periodic reports.',
  })
  async getAllReports() {
    try {
      const reports = await this.spsoReportService.getAllReports();

      return {
        statusCode: 200,
        message: 'Reports retrieved successfully',
        data: reports,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  @Get('generate-monthly')
  @ApiOperation({ summary: 'Generate report for a specific month and year' })
  @ApiResponse({
    status: 200,
    description: 'Returns the Base64 encoded PDF content of the report.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid month, year, or no data found.',
  })
  async generateReport(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    try {
      console.log('checking month and year', month, year);
      const monthInt = parseInt(month, 10);
      const yearInt = parseInt(year, 10);

      if (isNaN(monthInt) || isNaN(yearInt)) {
        throw new BadRequestException('Month and year must be numbers');
      }

      const base64Report = await this.spsoReportService.generateReportForMonth(
        monthInt,
        yearInt,
      );

      return {
        statusCode: 200,
        message: 'Reports retrieved successfully',
        data: base64Report,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  @Get('generate-yearly')
  @ApiOperation({ summary: 'Generate report for a specific year' })
  @ApiResponse({
    status: 200,
    description: 'Returns the Base64 encoded PDF content of the report.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid year or no data found.',
  })
  async generateYearlyReport(@Query('year') year: string) {
    try {
      const yearInt = parseInt(year, 10);

      if (isNaN(yearInt)) {
        throw new BadRequestException('Year must be a number');
      }

      const base64Report =
        await this.spsoReportService.generateReportForYear(yearInt);
      return {
        statusCode: 200,
        message: 'Reports retrieved successfully',
        data: base64Report,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }
}
