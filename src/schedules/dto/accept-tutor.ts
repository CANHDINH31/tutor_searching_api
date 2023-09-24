import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptTutor {
  @IsNotEmpty()
  @IsString()
  student_id: string;

  @IsNotEmpty()
  @IsString()
  schedule_id: string;
}
