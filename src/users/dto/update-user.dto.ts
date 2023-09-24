import { IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;
  @IsString()
  phone: string;
  @IsNumber()
  gender: number;
  @IsString()
  date_of_birth: string;
}
