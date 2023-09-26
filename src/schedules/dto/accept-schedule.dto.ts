import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptSchedule {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  schedule_id: string;
}
