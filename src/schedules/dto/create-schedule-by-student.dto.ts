import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScheduleByStudentDto {
  @IsNotEmpty()
  @IsString()
  student_id: string;

  @IsNotEmpty()
  @IsString()
  subject_id: string;

  @ArrayNotEmpty()
  time: string[];

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
