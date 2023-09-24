import { IsNotEmpty, IsString } from 'class-validator';

export class MyScheduleDto {
  @IsNotEmpty()
  @IsString()
  _id: string;
}
