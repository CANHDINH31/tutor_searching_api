import { IsNotEmpty, IsString } from 'class-validator';

export class MyRegisterDto {
  @IsNotEmpty()
  @IsString()
  _id: string;
}
