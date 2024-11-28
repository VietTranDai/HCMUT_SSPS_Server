import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SPSOPrintServiceService } from './spsoPrintService.service';

@ApiBearerAuth()
@ApiTags('SPSO Print Service')
@Controller('spso/print-service')
export class SPSOPrintServiceController {
  constructor(
    private readonly spsoPrintServiceService: SPSOPrintServiceService,
  ) {
    /*        
        ALL CONTROLLER FOR GET METHOD
    */
    /*
        ALL CONTROLLER FOR POST METHOD
    */
    /*
        ALL CONTROLLER FOR PUT METHOD
    */
    /*
        ALL CONTROLLER FOR DELETE METHOD
    */
  }
}
