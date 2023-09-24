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

      if (checkedExistTutor.money < createScheduleByTutorDto.price * 3)
        throw new BadRequestException({
          message: 'Số tiền trong tài khoản của bạn chưa đủ để đăng kí lớp',
        });

      const existedClass = await this.scheduleModal
        .findOne({
          tutor_id: createScheduleByTutorDto.tutor_id,
          time: { $in: createScheduleByTutorDto.time },
        })
        .populate('subject_id');

      if (existedClass)
        throw new BadRequestException({
          message: `Bạn đã đăng kí lớp vào khung giờ này`,
          data: existedClass,
        });

      const data = await this.scheduleModal.create({
        ...createScheduleByTutorDto,
        type: 2,
      });

      await this.userService.cashMoney({
        _id: createScheduleByTutorDto.tutor_id,
        money: Number(createScheduleByTutorDto.price) * -3,
      });

      return {
        status: HttpStatus.OK,
        message: 'Đăng kí lớp thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async createByStudent(
    createScheduleByStudentDto: CreateScheduleByStudentDto,
  ) {
    try {
      const checkedExistStudent = await this.userService.findOne(
        createScheduleByStudentDto.student_id,
      );
      if (!checkedExistStudent)
        throw new BadRequestException({
          message: 'Bạn không phải là học sinh',
        });

      if (checkedExistStudent.money < createScheduleByStudentDto.price * 3)
        throw new BadRequestException({
          message: 'Số tiền trong tài khoản của bạn chưa đủ để đăng kí lớp',
        });

      const existedClass = await this.scheduleModal
        .findOne({
          student_id: createScheduleByStudentDto.student_id,
          time: { $in: createScheduleByStudentDto.time },
        })
        .populate('subject_id');

      if (existedClass)
        throw new BadRequestException({
          message: `Bạn đã đăng kí lớp vào khung giờ này`,
          data: existedClass,
        });

      const data = await this.scheduleModal.create({
        ...createScheduleByStudentDto,
        type: 1,
      });

      await this.userService.cashMoney({
        _id: createScheduleByStudentDto.student_id,
        money: Number(createScheduleByStudentDto.price) * -3,
      });

      return {
        status: HttpStatus.OK,
        message: 'Đăng kí lớp thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findTutor() {
    try {
      const data = await this.scheduleModal
        .find({
          is_accepted: false,
          type: 2,
          student_id: { $exists: false },
        })
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
        .find({ is_accepted: false, type: 1, tutor_id: { $exists: false } })
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
