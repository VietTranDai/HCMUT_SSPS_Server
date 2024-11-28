import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SPSODefaultConfigService } from './spsoDefaultConfig.service';
import { CreateDefaultConfigReq } from './request/dto.createDefaultConfigReq';
import { Public } from 'src/common/decorators/public.decorators';

@Public()
// @ApiBearerAuth()
@ApiTags('SPSO Default Config')
@Controller('spso/default-config')
export class SPSODefaultConfigController {
  constructor(
    private readonly spsoDefaultConfigService: SPSODefaultConfigService,
  ) {}

  /*        
        ALL CONTROLLER FOR GET METHOD
    */

  @Get('get-all')
  @ApiOperation({ summary: 'Retrieve all default configurations' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all default configurations',
    schema: {
      example: {
        statusCode: 200,
        message: 'Successfully retrieved default configurations',
        data: [
          {
            id: '1234-5678-9101-1121',
            spsoId: 'spso-001',
            defaultPage: 10,
            permittedFileTypes: ['pdf', 'docx', 'xlsx'],
            firstTermGivenDate: '2024-11-30T00:00:00.000Z',
            secondTermGivenDate: '2024-11-30T00:00:00.000Z',
            thirdTermGivenDate: '2024-11-30T00:00:00.000Z',
            isLastConfiguration: true,
            createdAt: '2024-11-01T10:00:00.000Z',
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
        message: 'Validation error',
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
  async getAllConfigurations() {
    try {
      const configurations =
        await this.spsoDefaultConfigService.getAllConfigurations();
      return {
        statusCode: 200,
        message: 'Successfully retrieved default configurations',
        data: configurations,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  @Get('get-by-id/:id')
  @ApiOperation({ summary: 'Retrieve a specific default configuration by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the default configuration',
    schema: {
      example: {
        id: '1234-5678-9101-1121',
        spsoId: 'spso-001',
        defaultPage: 10,
        permittedFileTypes: ['pdf', 'docx', 'xlsx'],
        firstTermGivenDate: '2024-11-30T00:00:00.000Z',
        secondTermGivenDate: '2024-11-30T00:00:00.000Z',
        thirdTermGivenDate: '2024-11-30T00:00:00.000Z',
        isLastConfiguration: true,
        createdAt: '2024-11-01T10:00:00.000Z',
      },
    },
  })
  async getConfigurationById(@Param('id') id: string) {
    try {
      const configuration =
        await this.spsoDefaultConfigService.getConfigurationById(id);
      return {
        statusCode: 200,
        message: 'Successfully retrieved the default configuration',
        data: configuration,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  @Get('get')
  @ApiOperation({
    summary: 'Retrieve the latest default configuration for a specific SPSO',
    description:
      'Fetches the most recent default configuration where `isLastConfiguration` is true for the given SPSO ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the latest default configuration',
    schema: {
      example: {
        statusCode: 200,
        message: 'Successfully retrieved the latest default configuration',
        data: {
          id: '1234-5678-9101-1121',
          spsoId: 'spso-001',
          defaultPage: 20,
          permittedFileTypes: ['pdf', 'docx', 'jpg'],
          firstTermGivenDate: '2024-11-30T00:00:00.000Z',
          secondTermGivenDate: '2024-11-30T00:00:00.000Z',
          thirdTermGivenDate: '2024-11-30T00:00:00.000Z',
          isLastConfiguration: true,
          createdAt: '2024-11-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No latest configuration found for the given SPSO ID.',
    schema: {
      example: {
        statusCode: 400,
        message: 'No latest configuration found for SPSO with ID spso-001',
      },
    },
  })
  async getLatestConfiguration() {
    try {
      const latestConfig =
        await this.spsoDefaultConfigService.getLatestConfiguration();
      return {
        statusCode: 200,
        message: 'Successfully retrieved the latest default configuration',
        data: latestConfig,
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

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new default configuration' })
  @ApiBody({
    description: 'Payload to create a new default configuration',
    schema: {
      example: {
        spsoId: 'spso-001',
        defaultPage: 10,
        permittedFileTypes: [
          'pdf',
          'doc',
          'png',
          'docx',
          'xlsx',
          'pptx',
          'jpg',
          'txt',
        ], // Định dạng file được phép
        firstTermGivenDate: new Date('2024-09-01T00:00:00.000Z'), // Ngày cấp giấy kỳ 1
        secondTermGivenDate: new Date('2024-01-01T00:00:00.000Z'), // Ngày cấp giấy kỳ 2
        thirdTermGivenDate: new Date('2024-06-01T00:00:00.000Z'), // Ngày cấp giấy kỳ 3
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the default configuration',
    schema: {
      example: {
        statusCode: 201,
        message: 'Default configuration created successfully',
        data: {
          id: '1234-5678-9101-1121',
          spsoId: 'spso-001',
          defaultPage: 20,
          permittedFileTypes: ['pdf', 'docx', 'jpg'],
          defaultGivenDate: '2024-11-30T00:00:00.000Z',
          isLastConfiguration: true,
          createdAt: '2024-11-01T10:00:00.000Z',
        },
      },
    },
  })
  async createConfiguration(
    @Body() createDefaultConfigReq: CreateDefaultConfigReq,
  ) {
    try {
      const newConfig = await this.spsoDefaultConfigService.createConfiguration(
        createDefaultConfigReq,
      );
      return {
        statusCode: 201,
        message: 'Default configuration created successfully',
        data: newConfig,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'An unexpected error occurred',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /*
        ALL CONTROLLER FOR DELETE METHOD
    */

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a default configuration by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the default configuration',
    schema: {
      example: {
        statusCode: 200,
        message: 'Default configuration deleted successfully',
      },
    },
  })
  async deleteConfiguration(@Param('id') id: string) {
    try {
      await this.spsoDefaultConfigService.deleteConfiguration(id);
      return {
        statusCode: 200,
        message: 'Default configuration deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'An unexpected error occurred',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
