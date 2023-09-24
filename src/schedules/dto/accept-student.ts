import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptStudent {
  @IsNotEmpty()
  @IsString()
  tutor_id: string;

  @IsNotEmpty()
  @IsString()
  schedule_id: string;
}
