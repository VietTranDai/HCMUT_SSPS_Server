import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SPSOPrinterService } from './spsoPrinter.service';
import { SearchPrintersReq } from './request/dto.searchPrinterReq';
import { CreatePrinterReq } from './request/dto.createPrinterReq';
import { UpdatePrinterReq } from './request/dto.updatePrinterReq';
import { Public } from 'src/common/decorators/public.decorators';

// @ApiBearerAuth()
@Public()
@ApiTags('SPSO Printer')
@Controller('spso/printer')
export class SPSOPrinterController {
  constructor(private readonly spsoPrinterService: SPSOPrinterService) {}

  /*        
        ALL CONTROLLER FOR GET METHOD
    */

  @Get('get-all')
  @ApiOperation({ summary: 'Retrieve all printers' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved printers.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Successfully retrieved printers',
        data: [
          {
            id: '1234-5678-9101-1121',
            brandName: 'HP',
            model: 'LaserJet 1020',
            shortDescription: 'Compact laser printer',
            printerStatus: 'ENABLE',
            isInProgress: false,
            locationId: 'loc-001',
            createdAt: '2024-11-01T10:00:00.000Z',
            updatedAt: '2024-11-26T14:20:39.722Z',
          },
        ],
      },
    },
  })
  async getAllPrinters() {
    try {
      const printers = await this.spsoPrinterService.getAllPrinters();
      return {
        statusCode: 200,
        message: 'Successfully retrieved printers',
        data: printers,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  @Get('get-by-id/:id')
  @ApiOperation({ summary: 'Retrieve details of a printer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved printer details.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Successfully retrieved printer details',
        data: {
          id: '1234-5678-9101-1121',
          brandName: 'HP',
          model: 'LaserJet 1020',
          shortDescription: 'Compact laser printer',
          printerStatus: 'ENABLE',
          isInProgress: false,
          locationId: 'loc-001',
          createdAt: '2024-11-01T10:00:00.000Z',
          updatedAt: '2024-11-26T14:20:39.722Z',
        },
      },
    },
  })
  async getPrinterDetails(@Param('id') id: string) {
    try {
      const printer = await this.spsoPrinterService.getPrinterDetails(id);
      return {
        statusCode: 200,
        message: 'Successfully retrieved printer details',
        data: printer,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  /*        
        ALL CONTROLLER FOR POST METHOD
    */

  @Post('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Search for printers based on various conditions',
    description:
      'This endpoint allows searching for printers by various conditions such as ID, brand name, printer status, progress status, and location details (campus, building, and room names).',
  })
  @ApiBody({
    description: 'Conditions for searching printers',
    schema: {
      example: {
        id: '1234-5678-9101-1121',
        brandName: 'Canon',
        printerStatus: 'ENABLE',
        isInProgress: false,
        campusName: 'CS1',
        buildingName: 'A1',
        roomName: 'A1-102',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully retrieved printers.',
    schema: {
      example: {
        statusCode: 201,
        message: 'Successfully retrieved printers',
        data: [
          {
            id: '1234-5678-9101-1121',
            brandName: 'Canon',
            model: 'PIXMA TR8620a',
            shortDescription: 'All-in-one color inkjet printer',
            printerStatus: 'ENABLE',
            isInProgress: false,
            location: {
              campusName: 'CS1',
              buildingName: 'B1',
              roomName: 'B1-102',
            },
            createdAt: '2024-11-01T10:00:00.000Z',
            updatedAt: '2024-11-26T14:20:39.722Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or bad request.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation error: campusName must be a string',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred',
      },
    },
  })
  async searchPrinters(@Body() searchPrintersReq: SearchPrintersReq) {
    try {
      const printers =
        await this.spsoPrinterService.searchPrintersByConditions(
          searchPrintersReq,
        );
      return {
        statusCode: 201,
        message: 'Successfully retrieved printers',
        data: printers,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new printer' })
  @ApiBody({
    description: 'Payload for creating a new printer.',
    schema: {
      example: {
        brandName: 'Canon',
        model: 'PIXMA TS9120',
        shortDescription: 'All-in-one inkjet printer',
        printerStatus: 'ENABLE',
        locationId: 'loc-002',
      },
    },
  })
  async createPrinter(@Body() createPrinterReq: CreatePrinterReq) {
    try {
      const newPrinter =
        await this.spsoPrinterService.createPrinter(createPrinterReq);
      return {
        statusCode: 201,
        message: 'Printer created successfully',
        data: newPrinter,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  /*        
        ALL CONTROLLER FOR PATCH METHOD
    */

  @Patch('update-info')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Update printer information' })
  @ApiBody({
    description: 'Payload to update printer information.',
    schema: {
      example: {
        id: '1234-5678-9101-1121',
        brandName: 'Canon',
        model: 'PIXMA TS9120',
        shortDescription: 'Updated description',
        printerStatus: 'ENABLE',
        isInProgress: true,
        locationId: 'loc-002',
      },
    },
  })
  async updatePrinter(@Body() updatePrinterReq: UpdatePrinterReq) {
    try {
      const updatedPrinter =
        await this.spsoPrinterService.updatePrinterInfo(updatePrinterReq);
      return {
        statusCode: 200,
        message: 'Printer information updated successfully',
        data: updatedPrinter,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  /*        
        ALL CONTROLLER FOR DELETE METHOD
    */

  @Delete('delete/:printerId')
  @ApiOperation({ summary: 'Delete a printer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the printer.',
    schema: {
      example: {
        statusCode: 200,
        message:
          'Printer with ID 1234-5678-9101-1121 has been deleted successfully',
      },
    },
  })
  async deletePrinter(@Param('printerId') printerId: string) {
    try {
      await this.spsoPrinterService.deletePrinter(printerId);
      return {
        statusCode: 200,
        message: `Printer with ID ${printerId} has been deleted successfully`,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }
}
