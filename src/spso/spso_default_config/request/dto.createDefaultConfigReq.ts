import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateDefaultConfigReq {
  @IsNotEmpty()
  @IsString()
  spsoId: string;

  @IsNotEmpty()
  @IsInt()
  defaultPage: number;

  @IsNotEmpty()
  @IsArray()
  permittedFileTypes: string[];

  @IsNotEmpty()
  @IsDateString()
  firstTermGivenDate: string;

  @IsNotEmpty()
  @IsDateString()
  secondTermGivenDate: string;

  @IsNotEmpty()
  @IsDateString()
  thirdTermGivenDate: string;
}
