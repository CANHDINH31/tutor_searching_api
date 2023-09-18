import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleByTutorDto } from './dto/create-schedule-by-tutor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from 'src/schemas/schedules.schema';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModal: Model<Schedule>,
  ) {}
  async createByTutor(createScheduleByTutorDto: CreateScheduleByTutorDto) {
    try {
      const data = await this.scheduleModal.create({
        ...createScheduleByTutorDto,
      });
      return {
        status: HttpStatus.OK,
        message: 'Đăng kí lớp thành công',
        data,
      };
    } catch (error) {}
  }

  async findTutor() {
    try {
      const data = await this.scheduleModal
        .find({ is_accepted: false })
        .populate({ path: 'tutor_id', select: '-password' })
        .populate('subject_id');

      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all schedules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
