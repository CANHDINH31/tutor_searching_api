import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { FindScheduleDto } from './dto/find-schedule-dto';
import { AcceptSchedule } from './dto/accept-schedule.dto';
import { MyScheduleDto } from './dto/my-schedule';
import { MyRegisterDto } from './dto/my-register';
import { RemoveScheduleDto } from './dto/remove-schedule';
import { MyScheduleTodayDto } from './dto/my-schedule-today';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('/create')
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Post('/find')
  find(@Body() findScheduleDto: FindScheduleDto) {
    return this.schedulesService.find(findScheduleDto);
  }

  @Post('/my-schedule')
  mySchedule(@Body() myScheduleDto: MyScheduleDto) {
    return this.schedulesService.mySchedule(myScheduleDto);
  }

  @Post('/my-schedule-today')
  myScheduleToday(@Body() myScheduleTodayDto: MyScheduleTodayDto) {
    return this.schedulesService.myScheduleToday(myScheduleTodayDto);
  }

  @Post('/my-register')
  myRegister(@Body() myRegisterDto: MyRegisterDto) {
    return this.schedulesService.myRegister(myRegisterDto);
  }

  @Post('/accept')
  accept(@Body() acceptSchedule: AcceptSchedule) {
    return this.schedulesService.accept(acceptSchedule);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Get('/')
  index() {
    return this.schedulesService.index();
  }

  @Post('remove-schedule')
  remove(@Body() removeScheduleDto: RemoveScheduleDto) {
    return this.schedulesService.remove(removeScheduleDto);
  }
}
