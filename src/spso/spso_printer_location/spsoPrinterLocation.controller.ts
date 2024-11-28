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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SPSOPrinterLocationService } from './spsoPrinterLocation.service';
import { Public } from 'src/common/decorators/public.decorators';
import { CreatePrinterLocationReq } from './request/dto.CreatePrinterLocationReq';

@Public()
// @ApiBearerAuth()
@ApiTags('SPSO Printer Location')
@Controller('spso/printer-location')
export class SPSOPrinterLocationController {
  constructor(
    private readonly spsoPrinterLocationService: SPSOPrinterLocationService,
  ) {}

  /*        
        ALL CONTROLLER FOR GET METHOD
    */
  /*
        ALL CONTROLLER FOR POST METHOD
    */
  @Post('get-base-on-conditions')
  @ApiOperation({
    summary: 'Search printer locations based on conditions',
    description:
      'Retrieve printer location details based on specific conditions such as campusName, buildingName, or roomName.',
  })
  @ApiBody({
    description: 'Conditions for searching printer locations',
    schema: {
      example: {
        campusName: 'CS1', // Optional
        buildingName: 'A1', // Optional
        roomName: 'A1-101', // Optional
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully retrieved printer locations.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Successfully retrieved printer locations',
        data: [
          {
            id: 'A1-101',
            campusName: 'CS1',
            buildingName: 'A1',
            roomName: 'A1-101',
            campusAdress: '268 Lý Thường Kiệt, P.14, Q.10, Tp. HCM',
            hotline: '(+84) 28 38652 442',
            description: 'Administrative Office and Support Center',
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
        message: 'Validation error: Invalid input conditions',
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
  async searchPrinterLocations(
    @Body()
    body: {
      printerLocationId?: string;
      campusName?: string;
      buildingName?: string;
      roomName?: string;
    },
  ) {
    try {
      // Gọi service để tìm kiếm dữ liệu
      const printerLocations =
        await this.spsoPrinterLocationService.getLocationsBasedOnConditions({
          campusName: body.campusName,
          buildingName: body.buildingName,
          roomName: body.roomName,
          printerLocationId: body.printerLocationId,
        });

      return {
        statusCode: 200,
        message: 'Successfully retrieved printer locations',
        data: printerLocations,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create a new printer location',
    description: 'Creates a new printer location with the provided details.',
  })
  @ApiBody({
    description: 'Details of the printer location to create',
    schema: {
      example: {
        id: 'A1-102',
        campusName: 'CS1',
        buildingName: 'A1',
        roomName: 'A1-102',
        campusAdress: '268 Lý Thường Kiệt, P.14, Q.10, Tp. HCM',
        hotline: '(+84) 28 38652 442',
        description: 'Administrative Office and Support Center',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Printer location created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async createPrinterLocation(
    @Body() createPrinterLocationReq: CreatePrinterLocationReq,
  ) {
    try {
      const newLocation = await this.spsoPrinterLocationService.createLocation(
        createPrinterLocationReq,
      );
      return {
        statusCode: 201,
        message: 'Printer location created successfully',
        data: newLocation,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  /*
        ALL CONTROLLER FOR PUT METHOD
    */
  /*
        ALL CONTROLLER FOR DELETE METHOD
    */

  @Delete('delete/:locationId')
  @ApiOperation({
    summary: 'Delete a printer location',
    description: 'Deletes a printer location by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Printer location deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Printer location not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async deletePrinterLocation(
    @Param('locationId') locationId: string,
  ): Promise<any> {
    try {
      await this.spsoPrinterLocationService.deleteLocation(locationId);
      return {
        statusCode: 200,
        message: 'Printer location deleted successfully',
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }
}
