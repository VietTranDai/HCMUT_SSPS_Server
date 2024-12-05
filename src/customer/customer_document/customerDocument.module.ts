import { Module } from '@nestjs/common';
import { CustomerDocumentController } from './customerDocument.controller';
import { CustomerDocumentService } from './customerDocument.service';

@Module({
  imports: [],
  controllers: [CustomerDocumentController],
  providers: [CustomerDocumentService],
})
export class CustomerDocumentModule {}
