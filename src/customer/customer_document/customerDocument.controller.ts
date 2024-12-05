import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
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
import { CustomerDocumentService } from './customerDocument.service';
import { Public } from 'src/common/decorators/public.decorators';
import { SearchCustomerDocumentReq } from './request/dto.SearchCustomerDocumentReq';
import { CreateDocumentReq } from './request/dto.CreateDocumentReq';
import { UpdateDocumentReq } from './request/dto.UpdateDocumentReq';

@Public()
// @ApiBearerAuth()
@ApiTags('Customer Document')
@Controller('customer/document')
export class CustomerDocumentController {
  constructor(
    private readonly customerDocumentService: CustomerDocumentService,
  ) {}

  /*        
        ALL CONTROLLER FOR GET METHOD
    */

  @Get('by-customer')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Retrieve documents by customer ID',
    description: 'Fetch all documents associated with a specific customer ID.',
  })
  @ApiQuery({
    name: 'customerId',
    type: String,
    description: 'The ID of the customer whose documents you want to retrieve.',
    required: true,
    example: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved documents.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Successfully retrieved documents',
        data: [
          {
            id: '1234-5678-9101-1121',
            customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
            fileName: 'example.pdf',
            fileType: 'pdf',
            totalCostPage: 20,
            documentStatus: 'PENDING',
            createdAt: '2024-11-01T10:00:00.000Z',
          },
        ],
      },
    },
  })
  async getDocumentsByCustomer(@Query('customerId') customerId: string) {
    try {
      const documents =
        await this.customerDocumentService.getDocumentsByCustomer(customerId);
      return {
        statusCode: 200,
        message: 'Successfully retrieved documents',
        data: documents,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  // API lấy nội dung document theo ID
  @Get(':id/content')
  @ApiOperation({ summary: 'Retrieve the content of a document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the document content.',
    schema: {
      example: {
        id: '1234-5678-9101-1121',
        content: '<base64_encoded_file_content>',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Document not found.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Document with ID 1234-5678-9101-1121 not found',
      },
    },
  })
  async getDocumentContent(@Param('id') id: string) {
    try {
      const documentContent =
        await this.customerDocumentService.getDocumentContent(id);

      // Mã hóa fileContent thành Base64
      const base64Content = documentContent.fileContent.toString('base64');

      return {
        statusCode: 200,
        message: 'Successfully retrieved the document content.',
        data: {
          document: documentContent.document,
          content: base64Content,
        },
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

  @Post('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Search for documents with specific conditions',
    description:
      'Search for documents based on customer ID, document ID, creation time range, and document status.',
  })
  @ApiBody({
    description: 'Conditions for searching documents.',
    schema: {
      example: {
        customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
        id: '1234-5678-9101-1121',
        startTime: '2024-11-01T00:00:00.000Z',
        endTime: '2024-11-30T23:59:59.999Z',
        documentStatus: 'PENDING',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved documents based on conditions.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Successfully retrieved documents',
        data: [
          {
            id: '1234-5678-9101-1121',
            customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
            fileName: 'example.pdf',
            fileType: 'pdf',
            totalCostPage: 20,
            documentStatus: 'COMPLETED',
            createdAt: '2024-11-01T10:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred.',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred.',
      },
    },
  })
  async searchDocuments(
    @Body() searchCustomerDocumentReq: SearchCustomerDocumentReq,
  ) {
    try {
      const documents = await this.customerDocumentService.searchDocuments(
        searchCustomerDocumentReq,
      );
      return {
        statusCode: 200,
        message: 'Successfully retrieved documents',
        data: documents,
      };
    } catch (error) {
      const message = error?.message || 'An unexpected error occurred';
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(message, status);
    }
  }

  // API tạo document mới
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new document' })
  @ApiBody({
    description: 'Payload to create a new document.',
    schema: {
      example: {
        customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
        fileName: 'example.pdf',
        fileType: 'pdf',
        printSideType: 'SINGLE_SIDE',
        pageSize: 'A4',
        pageToPrint: [1, 2, 3],
        numOfCop: 2,
        fileContent: '<base64_encoded_file_content>',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the document.',
    schema: {
      example: {
        statusCode: 201,
        message: 'Document created successfully',
        data: {
          id: '1234-5678-9101-1121',
          customerId: '3e021fb4-0709-4a78-b95c-f218b6e1edd0',
          fileName: 'example.pdf',
          fileType: 'pdf',
          totalCostPage: 20,
          printSideType: 'SINGLE_SIDE',
          pageSize: 'A4',
          numOfCop: 2,
          documentStatus: 'PENDING',
          createdAt: '2024-11-01T10:00:00.000Z',
        },
      },
    },
  })
  async createDocument(@Body() createDocumentReq: CreateDocumentReq) {
    try {
      const document =
        await this.customerDocumentService.createDocument(createDocumentReq);
      return {
        statusCode: 201,
        message: 'Document created successfully',
        data: document,
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

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing document by ID',
    description:
      'Update the details of a document such as file name, file type, print options, and more.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the document to update',
    type: String,
  })
  @ApiBody({
    description: 'Payload to update an existing document.',
    schema: {
      example: {
        fileName: 'updated-report.pdf', // Tên file mới
        fileType: 'pdf', // Loại file
        printSideType: 'SINGLE_SIDE', // Kiểu in (mặt đơn)
        pageSize: 'A4', // Kích thước giấy
        pageToPrint: [1, 2, 3, 4, 5], // Các trang cần in
        numOfCop: 1, // Số bản sao
        documentStatus: 'PENDING', // Trạng thái tài liệu
        fileContent: '<base64_encoded_file_content>', // Mã Base64 của file PDF
      },
    },
  })
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentReq: UpdateDocumentReq,
  ) {
    try {
      const updatedDocument = await this.customerDocumentService.updateDocument(
        id,
        updateDocumentReq,
      );
      return {
        statusCode: 200,
        message: 'Document updated successfully',
        data: updatedDocument,
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
}
