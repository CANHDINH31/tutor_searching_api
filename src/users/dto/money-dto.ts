import { IsNumber } from 'class-validator';

export class MoneyDto {
  @IsNumber()
  money: number;
}
