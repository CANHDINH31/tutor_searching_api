import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleByTutorDto } from './dto/create-schedule-by-tutor.dto';
import { CreateScheduleByStudentDto } from './dto/create-schedule-by-student.dto';
import { FindScheduleDto } from './dto/find-schedule-dto';
import { AcceptTutor } from './dto/accept-tutor';
import { AcceptStudent } from './dto/accept-student';
import { MyScheduleDto } from './dto/my-schedule';
import { MyRegisterDto } from './dto/my-register';
import { RemoveScheduleDto } from './dto/remove-schedule';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('/create-by-tutor')
  createByTutor(@Body() createScheduleByTutorDto: CreateScheduleByTutorDto) {
    return this.schedulesService.createByTutor(createScheduleByTutorDto);
  }

  @Post('/create-by-student')
  createByStudent(
    @Body() createScheduleByStudentDto: CreateScheduleByStudentDto,
  ) {
    return this.schedulesService.createByStudent(createScheduleByStudentDto);
  }

  @Post('/find-tutor')
  findTutor(@Body() findScheduleDto: FindScheduleDto) {
    return this.schedulesService.findTutor(findScheduleDto);
  }

  @Post('/my-schedule')
  mySchedule(@Body() myScheduleDto: MyScheduleDto) {
    return this.schedulesService.mySchedule(myScheduleDto);
  }

  @Post('/my-register')
  myRegister(@Body() myRegisterDto: MyRegisterDto) {
    return this.schedulesService.myRegister(myRegisterDto);
  }

  @Post('/find-student')
  findStudent(@Body() findScheduleDto: FindScheduleDto) {
    return this.schedulesService.findStudent(findScheduleDto);
  }

  @Post('/accept-tutor')
  acceptTutor(@Body() acceptTutor: AcceptTutor) {
    return this.schedulesService.acceptTutor(acceptTutor);
  }

  @Post('/accept-student')
  acceptStudent(@Body() acceptStudent: AcceptStudent) {
    return this.schedulesService.acceptStudent(acceptStudent);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Post('remove-schedule')
  remove(@Body() removeScheduleDto: RemoveScheduleDto) {
    return this.schedulesService.remove(removeScheduleDto);
  }
}
