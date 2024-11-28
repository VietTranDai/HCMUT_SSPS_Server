import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerPurchaseService } from './customerPurchase.service';
import { ApiStructureResponse } from 'src/dtos/dto.apiResponse';
import { CreatePurchaseLogReq } from './dtos/request/dto.createPurchaseReq';
// import { Public } from 'src/common/decorators/public.decorators';
import { UpdatePurchaseLogStatusReq } from './dtos/request/dto.updatePurchaseStatusReq';

// @Public()
@ApiBearerAuth()
@ApiTags('Customer Purchases')
@Controller('customer/purchase')
export class CustomerPurchaseController {
  constructor(
    private readonly customerPurchaseService: CustomerPurchaseService,
  ) {}

  /*        
        ALL CONTROLLER FOR GET METHOD
    */

  // Lấy tất cả giao dịch của khách hàng
  @Get('get-all-purchases')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Retrieve all purchases by customer ID',
    description:
      'Fetches all purchases associated with a specific customer ID.',
  })
  @ApiQuery({
    name: 'customerId',
    type: String,
    description: 'The ID of the customer whose purchases you want to retrieve',
    example: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved purchases.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Successfully retrieved purchases',
        data: [
          {
            id: '228f21c7-131e-488e-8f54-5b0392f97d51',
            customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
            orderId: 'ORD003',
            transactionTime: '2024-11-03T14:30:00.000Z',
            numberOfPage: 20,
            price: 40,
            purchaseStatus: 'FAILED',
          },
          {
            id: '2d117bd1-2330-452d-9b9c-94e101550ce3',
            customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
            orderId: 'ORD014',
            transactionTime: '2024-11-17T12:30:00.000Z',
            numberOfPage: 90,
            price: 180,
            purchaseStatus: 'COMPLETED',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Customer not found or invalid customer ID.',
    schema: {
      example: {
        statusCode: 400,
        message:
          'Customer with ID 3e021fb4-0709-4a78-b95c-f218b6e1eddd0 not found',
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
  async getPurchasesByCustomerId(@Query('customerId') customerId: string) {
    try {
      const purchases =
        await this.customerPurchaseService.getPurchasesByCustomerId(customerId);

      return new ApiStructureResponse(
        200,
        'Successfully retrieved purchases',
        purchases,
      );
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  // Lấy chi tiết giao dịch theo customerId và purchaseId
  @Get('get-purchase-detail')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Retrieve purchase details',
    description: 'Fetches purchase details by customer ID and purchase ID.',
  })
  @ApiQuery({
    name: 'customerId',
    type: String,
    description: 'The ID of the customer.',
    example: '12345',
  })
  @ApiQuery({
    name: 'purchaseId',
    type: String,
    description: 'The ID of the purchase.',
    example: '67890',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved purchase detail.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Successfully retrieved purchase detail',
        data: {
          id: '2d117bd1-2330-452d-9b9c-94e101550ce3',
          customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
          orderId: 'ORD014',
          transactionTime: '2024-11-17T12:30:00.000Z',
          numberOfPage: 90,
          price: 180,
          purchaseStatus: 'COMPLETED',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Customer not found or invalid parameters.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Customer with ID 12345 not found',
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
  async getPurchaseDetails(
    @Query('customerId') customerId: string,
    @Query('purchaseId') purchaseId: string,
  ) {
    try {
      const purchase = await this.customerPurchaseService.getPurchaseDetails(
        customerId,
        purchaseId,
      );

      return new ApiStructureResponse(
        200,
        'Successfully retrieved purchase detail',
        purchase,
      );
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  /*        
        ALL CONTROLLER FOR POST METHOD
    */

  @Post('get-based-on-conditions')
  @ApiOperation({
    summary: 'Search purchases based on conditions',
    description:
      'Search for purchases based on specific conditions such as id, customerId, startTime, and endTime.',
  })
  @ApiBody({
    description: 'Conditions for searching purchases',
    schema: {
      example: {
        id: '10def683-9b2b-427f-bcba-18c9b64038c9', // Optional
        customerId: 'cc3059fc-1acc-4600-9053-8676a6617743', // Optional
        startTime: '2024-11-01T00:00:00.000Z', // Optional (ISO string)
        endTime: '2024-11-30T23:59:59.999Z', // Optional (ISO string)
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully retrieved purchases.',
    schema: {
      example: {
        statusCode: 201,
        message: 'Successfully retrieved purchases',
        data: [
          {
            id: '10def683-9b2b-427f-bcba-18c9b64038c9',
            customerId: 'cc3059fc-1acc-4600-9053-8676a6617743',
            orderId: 'ORD018',
            transactionTime: '2024-11-21T08:15:00.000Z',
            numberOfPage: 100,
            price: 200,
            purchaseStatus: 'COMPLETED',
          },
          {
            id: '16b13765-c6bc-4088-8f61-6deb942c6fd8',
            customerId: 'b2c00df0-11d2-48af-87e2-ad55bdfd98f4',
            orderId: 'ORD001',
            transactionTime: '2024-11-01T10:00:00.000Z',
            numberOfPage: 50,
            price: 100,
            purchaseStatus: 'COMPLETED',
          },
          {
            id: '1ac10015-7a95-40cc-af21-9a076efaa0ab',
            customerId: 'fa2ef8dc-d4ac-486c-aa33-1cad8205d3e3',
            orderId: 'ORD010',
            transactionTime: '2024-11-10T20:15:00.000Z',
            numberOfPage: 50,
            price: 100,
            purchaseStatus: 'PENDING',
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
        message: 'Validation error: startTime must be a valid ISO date string',
        data: null,
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
        data: null,
      },
    },
  })
  async searchPurchases(
    @Body()
    body: {
      id?: string;
      customerId?: string;
      startTime?: string; // Nhận từ client dạng ISO string
      endTime?: string; // Nhận từ client dạng ISO string
    },
  ) {
    try {
      const startTime = body.startTime ? new Date(body.startTime) : undefined;
      const endTime = body.endTime ? new Date(body.endTime) : undefined;

      // Kiểm tra tính hợp lệ của startTime và endTime
      if (startTime && isNaN(startTime.getTime())) {
        throw new BadRequestException('Invalid startTime format');
      }
      if (endTime && isNaN(endTime.getTime())) {
        throw new BadRequestException('Invalid endTime format');
      }

      const purchases =
        await this.customerPurchaseService.getPurchasesBaseOnConditions({
          id: body.id,
          customerId: body.customerId,
          startTime: startTime,
          endTime: endTime,
        });

      return new ApiStructureResponse(
        201,
        'Successfully retrieved purchases',
        purchases,
      );
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  @Post('create-new-log')
  @ApiOperation({ summary: 'Create a new purchase log' }) // Mô tả ngắn gọn endpoint
  @ApiBody({
    description: 'Payload to create a new purchase log.',
    schema: {
      example: {
        customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
        orderId: 'ORD001',
        numberOfPage: 1,
        price: 10,
        purchaseStatus: 'COMPLETED',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The purchase log has been successfully created.',
    schema: {
      example: {
        status: 201,
        message: 'Purchase log created successfully',
        data: {
          id: 'ac908c6e-c9aa-4357-ab98-c51c0d051541',
          customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
          orderId: 'ORD001',
          transactionTime: '2024-11-26T14:20:39.722Z',
          numberOfPage: 1,
          price: 10,
          purchaseStatus: 'COMPLETED',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or customer not found.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Customer with ID 12345 not found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while creating the purchase log.',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred',
      },
    },
  })
  async createPurchaseLog(@Body() createPurchaseLogReq: CreatePurchaseLogReq) {
    try {
      const newPurchaseLog =
        await this.customerPurchaseService.createPurchaseLog(
          createPurchaseLogReq,
        );

      return {
        status: 201,
        message: 'Purchase log created successfully',
        data: newPurchaseLog,
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

  @Patch('update-status')
  @ApiOperation({ summary: 'Update the status of a purchase log' })
  @ApiBody({
    description: 'Payload to update purchase log status',
    schema: {
      example: {
        purchaseId: 'ac908c6e-c9aa-4357-ab98-c51c0d051541',
        purchaseStatus: 'COMPLETED',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated purchase log status.',
    schema: {
      example: {
        status: 200,
        message: 'Purchase log status updated successfully',
        data: {
          id: 'ac908c6e-c9aa-4357-ab98-c51c0d051541',
          customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
          orderId: 'ORD001',
          transactionTime: '2024-11-26T14:20:39.722Z',
          numberOfPage: 1,
          price: 10,
          purchaseStatus: 'COMPLETED',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid input.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Either id or customerId must be provided',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while update.',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred',
      },
    },
  })
  async updatePurchaseLogStatus(
    @Body() updatePurchaseLogStatusReq: UpdatePurchaseLogStatusReq,
  ) {
    try {
      const updatedLog =
        await this.customerPurchaseService.updatePurchaseLogStatus(
          updatePurchaseLogStatusReq,
        );

      return {
        status: 200,
        message: 'Purchase log status updated successfully',
        data: updatedLog,
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

  @Delete('delete-purchase')
  @ApiOperation({ summary: 'Delete a purchase log by purchaseId' })
  @ApiQuery({
    name: 'purchaseId',
    description: 'ID of the purchase log to be deleted',
    example: 'ac908c6e-c9aa-4357-ab98-c51c0d051541',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the purchase log.',
    schema: {
      example: {
        message:
          'Purchase log with ID ac908c6e-c9aa-4357-ab98-c51c0d051541 has been deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or missing parameters.',
    schema: {
      example: {
        statusCode: 400,
        message: 'purchaseId is required',
      },
    },
  })
  async deletePurchaseLog(@Query('purchaseId') purchaseId: string) {
    if (!purchaseId) {
      throw new BadRequestException('purchaseId is required');
    }
    try {
      const purchase =
        await this.customerPurchaseService.deletePurchaseLogById(purchaseId);

      return new ApiStructureResponse(
        200,
        `Purchase log with ID ${purchaseId} has been deleted successfully`,
        purchase,
      );
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }
}
