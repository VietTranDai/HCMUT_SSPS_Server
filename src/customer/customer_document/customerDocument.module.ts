import { Module } from '@nestjs/common';
import { CustomerDocumentController } from './customerDocument.controllert';
import { CustomerDocumentService } from './customerDocument.service';

@Module({
  imports: [],
  controllers: [CustomerDocumentController],
  providers: [CustomerDocumentService],
})
export class CustomerDocumentModule {}
