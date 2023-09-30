import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async register(registerDto: RegisterDto) {
    try {
      const existAccount = await this.userService.findByEmailAndUsername({
        email: registerDto.email,
        username: registerDto.username,
      });
      if (existAccount?.length > 0)
        throw new BadRequestException({
          message: 'Email hoặc Username đã tồn tại',
        });
      return await this.userService.create(registerDto);
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const existAccount = await this.userService.findByUsername(
        loginDto.username,
      );
      if (!existAccount)
        throw new BadRequestException({ message: 'Username không tồn tại' });

      // Check Password
      const isCorrectPassword = loginDto.password === existAccount.password;
      if (!isCorrectPassword)
        throw new BadRequestException({ message: 'Mật khẩu chưa chính xác' });

      if (existAccount?.is_block)
        throw new BadRequestException({
          message:
            'Tài khoản của bạn đã bị khóa, vui lòng liên hệ với admin để mở khóa',
        });
      return {
        status: HttpStatus.OK,
        message: 'Đăng nhập thành công',
        data: existAccount,
      };
    } catch (error) {
      throw error;
    }
  }
}
