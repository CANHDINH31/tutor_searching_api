import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { FindUserByEmailAndUsernameDto } from './dto/find-user-by-email-and-username.dto';
import { MoneyDto } from './dto/money-dto';
import { PasswordDto } from './dto/password-dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Schedule } from 'src/schemas/schedules.schema';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModal: Model<User>,
    @InjectModel(Schedule.name) private scheduleModal: Model<Schedule>,
    private configService: ConfigService,
  ) {}

  private encryptKey = this.configService.get('ENCRYPT_KEY');

  async statis(role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được danh sách người dùng',
      });
    }
    try {
      const count_student = await this.userModal
        .find({ role: 1 })
        .countDocuments();
      const count_tutor = await this.userModal
        .find({ role: 2 })
        .countDocuments();
      const count_schedule = await this.scheduleModal.find({}).countDocuments();
      return { count_student, count_tutor, count_schedule };
    } catch (error) {
      throw error;
    }
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const userCreated = await this.userModal.create({ ...createUserDto });
      const { password, ...data } = userCreated.toObject();
      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới user thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findByEmailAndUsername(
    findUserByEmailAndUsernameDto: FindUserByEmailAndUsernameDto,
  ) {
    try {
      const user = await this.userModal.find({
        $or: [
          { email: findUserByEmailAndUsernameDto.email },
          { username: findUserByEmailAndUsernameDto.username },
        ],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.userModal.findOne({ username });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAll(role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được danh sách người dùng',
      });
    }
    try {
      return await this.userModal
        .find({ role: { $ne: 3 } })
        .select('-password')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async findOne(encryptId: string) {
    const id = CryptoJS.AES.decrypt(encryptId, this.encryptKey).toString(
      CryptoJS.enc.Utf8,
    );
    try {
      return await this.userModal.findById(id);
    } catch (error) {}
  }

  async cashMoney(moneyDto: MoneyDto, userId: string) {
    try {
      const data = await this.userModal
        .findByIdAndUpdate(
          userId,
          { $inc: { money: moneyDto.money } },
          { new: true },
        )
        .select('-password');
      return {
        status: HttpStatus.CREATED,
        message: 'Nạp tiền thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(passwordDto: PasswordDto, userId: string) {
    try {
      const existedAccount = await this.findOne(userId);

      if (!existedAccount) {
        throw new BadRequestException({
          message: 'Tài khoản của bạn không tồn tại',
        });
      }

      if (
        !(await bcrypt.compare(
          passwordDto.old_password,
          existedAccount.password,
        ))
      ) {
        throw new BadRequestException({
          message: 'Mật khẩu cũ không chính xác',
        });
      }

      const password = await bcrypt.hash(passwordDto.new_password, 10);

      await this.userModal.findByIdAndUpdate(userId, {
        password,
      });
      return {
        status: HttpStatus.CREATED,
        message: 'Thay đổi mật khẩu thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async changeInfo(updateUserDto: UpdateUserDto, userId: string) {
    try {
      const data = await this.userModal.findByIdAndUpdate(
        userId,
        updateUserDto,
        {
          new: true,
        },
      );
      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật thông tin thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async block(encryptId: string, role: number) {
    const id = CryptoJS.AES.decrypt(encryptId, this.encryptKey).toString(
      CryptoJS.enc.Utf8,
    );

    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được khóa người dùng',
      });
    }
    try {
      const user = await this.userModal.findById(id);
      user.is_block = !user.is_block;
      await user.save();
      return {
        status: HttpStatus.OK,
        message: 'Thay đổi trạng thái thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(deleteUserDto: DeleteUserDto, role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được xóa người dùng',
      });
    }
    try {
      await this.userModal.deleteMany({ _id: { $in: deleteUserDto.list_id } });
      await this.scheduleModal.deleteMany({
        $or: [
          { tutor_id: { $in: deleteUserDto.list_id } },
          { student_id: { $in: deleteUserDto.list_id } },
        ],
      });
      return {
        status: HttpStatus.OK,
        message: 'Xóa người dùng thành công',
      };
    } catch (error) {
      throw error;
    }
  }
}
