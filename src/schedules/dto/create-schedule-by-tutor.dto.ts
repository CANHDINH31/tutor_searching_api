import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScheduleByTutorDto {
  @IsNotEmpty()
  @IsString()
  tutor_id: string;

  @IsNotEmpty()
  @IsString()
  subject_id: string;

  @ArrayNotEmpty()
  day: string[];

  @ArrayNotEmpty()
  hour: string[];

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
