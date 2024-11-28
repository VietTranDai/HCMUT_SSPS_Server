import { Module } from '@nestjs/common';
import { SPSODefaultConfigController } from './spsoDefaultConfig.controller';
import { SPSODefaultConfigService } from './spsoDefaultConfig.service';

@Module({
  imports: [],
  controllers: [SPSODefaultConfigController],
  providers: [SPSODefaultConfigService],
})
export class SPSODefaultConfigModule {}
