import { Module } from '@nestjs/common';
import { CustomerMomoController } from './customerMomo.controller';
import { CustomerMomoService } from './customerMomo.service';

@Module({
  imports: [],
  controllers: [CustomerMomoController],
  providers: [CustomerMomoService],
})
export class CustomerMomoModule {}
