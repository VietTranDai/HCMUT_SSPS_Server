import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePrinterLocationReq {
  @IsString()
  @IsNotEmpty()
  campusName: string; // Tên khuôn viên chứa máy in

  @IsString()
  @IsNotEmpty()
  buildingName: string; // Tên tòa nhà chứa máy in

  @IsString()
  @IsNotEmpty()
  roomName: string; // Số phòng đặt máy in

  @IsOptional()
  @IsString()
  description?: string; // Mô tả ngắn về vị trí máy in (tùy chọn)
}
