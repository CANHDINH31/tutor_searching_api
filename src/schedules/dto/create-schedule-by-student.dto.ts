import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScheduleByStudentDto {
  @IsNotEmpty()
  @IsString()
  student_id: string;

  @IsNotEmpty()
  @IsString()
  subject_id: string;

  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  day: number[];

  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  hour: number[];

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
