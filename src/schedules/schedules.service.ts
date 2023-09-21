import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleByTutorDto } from './dto/create-schedule-by-tutor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from 'src/schemas/schedules.schema';
import { CreateScheduleByStudentDto } from './dto/create-schedule-by-student.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModal: Model<Schedule>,
    private userService: UsersService,
  ) {}
  async createByTutor(createScheduleByTutorDto: CreateScheduleByTutorDto) {
    try {
      const checkedExistTutor = await this.userService.findOne(
        createScheduleByTutorDto.tutor_id,
      );
      if (!checkedExistTutor)
        throw new BadRequestException({ message: 'Bạn không phải là gia sư' });
      return await this.scheduleModal
        .findOne({
          $or: [
            {
              day: { $in: createScheduleByTutorDto.day },
              hour: { $in: createScheduleByTutorDto.hour },
            },
            {
              day: { $in: createScheduleByTutorDto.day },
              hour: { $elemMatch: { $in: createScheduleByTutorDto.hour } },
            },
          ],
        })
        .populate('subject_id');
      // const data = await this.scheduleModal.create({
      //   ...createScheduleByTutorDto,
      //   type: 2,
      // });
      // return {
      //   status: HttpStatus.OK,
      //   message: 'Đăng kí lớp thành công',
      //   data,
      // };
    } catch (error) {
      throw error;
    }
  }

  async createByStudent(
    createScheduleByStudentDto: CreateScheduleByStudentDto,
  ) {
    try {
      const data = await this.scheduleModal.create({
        ...createScheduleByStudentDto,
        type: 1,
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
        .find({ is_accepted: false, type: 2 })
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

  async findStudent() {
    try {
      const data = await this.scheduleModal
        .find({ is_accepted: false, type: 1 })
        .populate({ path: 'student_id', select: '-password' })
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
