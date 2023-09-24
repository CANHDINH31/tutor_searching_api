import { IsNumber, IsString } from 'class-validator';

export class MoneyDto {
  @IsString()
  _id: string;
  @IsNumber()
  money: number;
}
