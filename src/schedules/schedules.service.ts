import { UsersModule } from './../users/users.module';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateScheduleByTutorDto } from './dto/create-schedule-by-tutor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from 'src/schemas/schedules.schema';
import { CreateScheduleByStudentDto } from './dto/create-schedule-by-student.dto';
import { UsersService } from 'src/users/users.service';
import { FindScheduleDto } from './dto/find-schedule-dto';
import { AcceptTutor } from './dto/accept-tutor';
import { AcceptStudent } from './dto/accept-student';
import { MyScheduleDto } from './dto/my-schedule';
import { MyRegisterDto } from './dto/my-register';
import { RemoveScheduleDto } from './dto/remove-schedule';

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

      const timeArray = this.convertToTimeArray(
        createScheduleByTutorDto.day,
        createScheduleByTutorDto.hour,
      );

      const existedClass = await this.scheduleModal
        .findOne({
          tutor_id: createScheduleByTutorDto.tutor_id,
          time: { $in: timeArray },
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
        time: timeArray,
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

      const timeArray = this.convertToTimeArray(
        createScheduleByStudentDto.day,
        createScheduleByStudentDto.hour,
      );

      const existedClass = await this.scheduleModal
        .findOne({
          student_id: createScheduleByStudentDto.student_id,
          time: { $in: timeArray },
        })
        .populate('subject_id');

      if (existedClass)
        throw new BadRequestException({
          message: `Bạn đã đăng kí lớp vào khung giờ này`,
          data: existedClass,
        });

      const data = await this.scheduleModal.create({
        ...createScheduleByStudentDto,
        time: timeArray,
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

  async findTutor(findScheduleDto: FindScheduleDto) {
    try {
      let condition = {};
      if (findScheduleDto.subject_id) {
        condition = { ...condition, subject_id: findScheduleDto.subject_id };
      }

      if (findScheduleDto.price) {
        condition = { ...condition, price: { $lte: findScheduleDto.price } };
      }

      if (findScheduleDto.hour) {
        condition = { ...condition, hour: { $in: findScheduleDto.hour } };
      }

      if (findScheduleDto.day) {
        condition = { ...condition, day: { $in: findScheduleDto.day } };
      }

      const data = await this.scheduleModal
        .find({
          is_accepted: false,
          type: 2,
          student_id: { $exists: false },
          ...condition,
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

  async findStudent(findScheduleDto: FindScheduleDto) {
    try {
      let condition = {};
      if (findScheduleDto.subject_id) {
        condition = { ...condition, subject_id: findScheduleDto.subject_id };
      }

      if (findScheduleDto.price) {
        condition = { ...condition, price: { $lte: findScheduleDto.price } };
      }

      if (findScheduleDto.hour) {
        condition = { ...condition, hour: { $in: findScheduleDto.hour } };
      }

      if (findScheduleDto.day) {
        condition = { ...condition, day: { $in: findScheduleDto.day } };
      }

      const data = await this.scheduleModal
        .find({
          is_accepted: false,
          type: 1,
          tutor_id: { $exists: false },
          ...condition,
        })
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

  async acceptTutor(acceptTutor: AcceptTutor) {
    try {
      const checkedExistStudent = await this.userService.findOne(
        acceptTutor.student_id,
      );

      const schedule = await this.findOne(acceptTutor.schedule_id);

      if (!checkedExistStudent)
        throw new BadRequestException({
          message: 'Bạn không phải là học sinh',
        });

      if (checkedExistStudent.money < schedule.price * 3)
        throw new BadRequestException({
          message: 'Số tiền trong tài khoản của bạn chưa đủ để đăng kí lớp',
        });

      const existedClass = await this.scheduleModal
        .findOne({
          student_id: acceptTutor.student_id,
          time: { $in: schedule.time },
        })
        .populate('subject_id');

      if (existedClass)
        throw new BadRequestException({
          message: `Bạn đã đăng kí lớp vào khung giờ này`,
          data: existedClass,
        });

      const data = await this.scheduleModal.findByIdAndUpdate(
        acceptTutor.schedule_id,
        { student_id: acceptTutor.student_id, is_accepted: true },
        { new: true },
      );

      await this.userService.cashMoney({
        _id: acceptTutor.student_id,
        money: Number(schedule.price) * -3,
      });

      return {
        status: HttpStatus.OK,
        message: 'Bạn đã accept lớp này thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async acceptStudent(acceptStudent: AcceptStudent) {
    try {
      const checkedExistTutor = await this.userService.findOne(
        acceptStudent.tutor_id,
      );
      const schedule = await this.findOne(acceptStudent.schedule_id);
      if (!checkedExistTutor)
        throw new BadRequestException({
          message: 'Bạn không phải là gia sư',
        });
      if (checkedExistTutor.money < schedule.price * 3)
        throw new BadRequestException({
          message: 'Số tiền trong tài khoản của bạn chưa đủ để đăng kí lớp',
        });

      const existedClass = await this.scheduleModal
        .findOne({
          tutor_id: acceptStudent.tutor_id,
          time: { $in: schedule.time },
        })
        .populate('subject_id');
      if (existedClass)
        throw new BadRequestException({
          message: `Bạn đã đăng kí lớp vào khung giờ này`,
          data: existedClass,
        });

      const data = await this.scheduleModal.findByIdAndUpdate(
        acceptStudent.schedule_id,
        { tutor_id: acceptStudent.tutor_id, is_accepted: true },
        { new: true },
      );
      await this.userService.cashMoney({
        _id: acceptStudent.tutor_id,
        money: Number(schedule.price) * -3,
      });
      return {
        status: HttpStatus.OK,
        message: 'Bạn đã accept lớp này thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(_id: string) {
    try {
      return await this.scheduleModal.findOne({ _id });
    } catch (error) {
      throw error;
    }
  }

  async mySchedule(myScheduleDto: MyScheduleDto) {
    try {
      const user = await this.userService.findOne(myScheduleDto._id);
      if (!user)
        throw new BadRequestException({
          message: 'Không tồn tại người dùng',
        });
      let data;
      if (user.role === 1) {
        data = await this.scheduleModal.find({
          student_id: user._id,
          is_accepted: true,
        });
      } else {
        data = await this.scheduleModal.find({
          tutor_id: user._id,
          is_accepted: true,
        });
      }

      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async myRegister(myRegisterDto: MyRegisterDto) {
    try {
      const user = await this.userService.findOne(myRegisterDto._id);
      if (!user)
        throw new BadRequestException({
          message: 'Không tồn tại người dùng',
        });
      let data;
      if (user.role === 1) {
        data = await this.scheduleModal.find({
          student_id: user._id,
          is_accepted: false,
        });
      } else {
        data = await this.scheduleModal.find({
          tutor_id: user._id,
          is_accepted: false,
        });
      }

      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(removeScheduleDto: RemoveScheduleDto) {
    try {
      const schedule = await this.findOne(removeScheduleDto.schedule_id);
      if (!schedule)
        throw new BadRequestException({ message: 'Không có lịch trên' });
      if (schedule.type === 1) {
        await this.userService.cashMoney({
          _id: schedule.student_id,
          money: Number(schedule.price) * 3,
        });
      } else {
        await this.userService.cashMoney({
          _id: schedule.tutor_id,
          money: Number(schedule.price) * 3,
        });
      }
      await this.scheduleModal.findByIdAndRemove(removeScheduleDto.schedule_id);
      return {
        status: HttpStatus.ACCEPTED,
        message: 'Đã xóa thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  convertToTimeArray(day: string[], hour: string[]) {
    const time = [];

    for (let i = 0; i < day.length; i++) {
      time.push(day[i] + '-' + hour[i]);
    }

    return time;
  }
}
