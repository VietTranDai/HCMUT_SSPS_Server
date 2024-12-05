import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as crypto from 'crypto';
import axios from 'axios';
import { Public } from 'src/common/decorators/public.decorators';

@Public()
@ApiTags('Customer Momo')
@Controller('customer/momo')
export class CustomerMomoController {
  private readonly accessKey = 'F8BBA842ECF85';
  private readonly secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  private readonly partnerCode = 'MOMO';

  @Post('payment')
  @ApiOperation({ summary: 'Create a payment link' })
  async createPaymentLink(@Body() body: any) {
    const { order_id, totalCost } = body;
    const orderInfo = 'pay with MoMo';
    const redirectUrl = 'http://localhost:3000/customer/buy-page';
    const ipnUrl = 'https://7ab9-118-68-123-84.ngrok-free.app/callback';
    const amount = totalCost;
    const orderId = order_id;
    const requestId = orderId;
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';
    const requestType = 'captureWallet';

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      autoCapture,
      extraData,
      requestType,
      signature,
    };

    const option = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };

    try {
      const result = await axios(option);
      return result.data;
    } catch (error) {
      console.error('Error Response:', error.response?.data || error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create payment link',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('callback')
  @ApiOperation({ summary: 'Handle callback from MoMo' })
  handleCallback(@Body() body: any) {
    console.log('Callback::', body);
    return { message: 'Callback received', data: body };
  }

  @Post('transaction-status')
  @ApiOperation({ summary: 'Query transaction status' })
  async queryTransactionStatus(@Body() body: any) {
    const { orderId } = body;

    const rawSignature = `accessKey=${this.accessKey}&orderId=${orderId}&partnerCode=${this.partnerCode}&requestId=${orderId}`;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      requestId: orderId,
      orderId,
      signature,
      lang: 'vi',
    };

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error(
        'Error querying transaction:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to query transaction',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
