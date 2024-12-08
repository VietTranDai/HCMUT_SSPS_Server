import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerPrintServiceService } from './customerPrintService.service';
import { SearchPrintServiceLogReq } from './request/dto.SearchPrintServiceLogReq';
import { CreatePrintServiceLogReq } from './request/dto.CreatePrintServiceLogReq';
import { Public } from 'src/common/decorators/public.decorators';

@Public()
// @ApiBearerAuth()
@ApiTags('Customer Print Service')
@Controller('customer/print-service')
export class CustomerPrintServiceController {
  constructor(
    private readonly customerPrintServiceService: CustomerPrintServiceService,
  ) {}

  /*        
        ALL CONTROLLER FOR GET METHOD
    */

  @Get('get-by-id/:id')
  @ApiOperation({
    summary: 'Get a print service log by ID',
    description:
      'Retrieve the details of a specific print service log by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the print service log',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the print service log',
  })
  async getPrintServiceLogById(@Param('id') id: string) {
    try {
      const log =
        await this.customerPrintServiceService.getPrintServiceLogById(id);
      return {
        statusCode: 200,
        message: 'Print service log retrieved successfully',
        data: log,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'An unexpected error occurred',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('search')
  @ApiOperation({
    summary: 'Search print service logs with conditions',
    description:
      'Search for print service logs based on filters like customerId, printerId, documentId, serviceStatus, and date range.',
  })
  @ApiBody({
    description: 'Filters to search print service logs',
    type: SearchPrintServiceLogReq, // Type này phải khớp với body request của bạn
    examples: {
      example1: {
        value: {
          customerId: '12345',
          printerId: 'printer123',
          documentId: 'doc567',
          startTime: '2024-01-01',
          endTime: '2024-01-31',
          serviceStatus: 'COMPLETED',
        },
        description: 'Example with all filters applied',
      },
      example2: {
        value: {
          printerId: 'printer123',
          serviceStatus: 'PENDING',
        },
        description: 'Example with only printerId and serviceStatus filters',
      },
    },
  })
  async searchPrintServiceLogs(
    @Body() searchPrintServiceLogReq: SearchPrintServiceLogReq,
  ) {
    try {
      const logs =
        await this.customerPrintServiceService.searchPrintServiceLogs(
          searchPrintServiceLogReq,
        );

      return {
        statusCode: 201,
        message: 'Filtered print service logs retrieved successfully',
        data: logs,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'An unexpected error occurred',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /*        
        ALL CONTROLLER FOR POST METHOD
    */

  @Post('create')
  @ApiOperation({
    summary: 'Create new print service logs for multiple documents',
    description:
      'Create new print service logs for multiple documents at once.',
  })
  @ApiBody({
    description: 'The data to create new print service logs',
    type: CreatePrintServiceLogReq, // Dữ liệu body kiểu CreatePrintServiceLogReq
    examples: {
      example1: {
        value: {
          customerId: '12345',
          printerId: 'printer123',
          documentIds: ['doc567', 'doc789'],
        },
        description:
          'Example with customer ID, printer ID, and multiple document IDs',
      },
      example2: {
        value: {
          customerId: '67890',
          printerId: 'printer456',
          documentIds: ['doc123'],
        },
        description: 'Example with a single document ID',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the print service logs',
  })
  async createPrintServiceLog(
    @Body() createPrintServiceLogReq: CreatePrintServiceLogReq,
  ) {
    try {
      const newLogs =
        await this.customerPrintServiceService.createPrintServiceLogs(
          createPrintServiceLogReq,
        );
      return {
        statusCode: 201,
        message: 'Print service logs created successfully',
        data: newLogs,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'An unexpected error occurred',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*        
        ALL CONTROLLER FOR PUT METHOD
    */

  /*        
        ALL CONTROLLER FOR DELETE METHOD
    */
}
