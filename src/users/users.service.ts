import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { FindUserByEmailAndUsernameDto } from './dto/find-user-by-email-and-username.dto';
import { MoneyDto } from './dto/money-dto';
import { PasswordDto } from './dto/password-dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModal: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const userCreated = await this.userModal.create({ ...createUserDto });
      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới user thành công',
        data: userCreated,
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

  async findAll() {
    try {
      return await this.userModal
        .find({ role: { $ne: 3 } })
        .select('-password');
    } catch (error) {}
  }

  async findOne(id: string) {
    try {
      return await this.userModal.findById(id);
    } catch (error) {}
  }

  async cashMoney(moneyDto: MoneyDto) {
    try {
      const data = await this.userModal.findByIdAndUpdate(
        moneyDto._id,
        { $inc: { money: moneyDto.money } },
        { new: true },
      );
      return {
        status: HttpStatus.CREATED,
        message: 'Nạp tiền thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(passwordDto: PasswordDto) {
    try {
      const existedAccount = await this.findOne(passwordDto._id);
      if (!existedAccount) {
        throw new BadRequestException({
          message: 'Tài khoản của bạn không tồn tại',
        });
      }
      if (existedAccount.password !== passwordDto.old_password)
        throw new BadRequestException({
          message: 'Mật khẩu cũ không chính xác',
        });
      await this.userModal.findByIdAndUpdate(passwordDto._id, {
        password: passwordDto.new_password,
      });
      return {
        status: HttpStatus.CREATED,
        message: 'Thay đổi mật khẩu thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async changeInfo(updateUserDto: UpdateUserDto) {
    try {
      const { _id, ...rest } = updateUserDto;
      const data = await this.userModal.findByIdAndUpdate(_id, rest, {
        new: true,
      });
      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật thông tin thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
