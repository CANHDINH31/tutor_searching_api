import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MoneyDto } from './dto/money-dto';
import { PasswordDto } from './dto/password-dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/statis')
  statis() {
    return this.usersService.statis();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('/cash')
  cashMoney(@Body() moneyDto: MoneyDto) {
    return this.usersService.cashMoney(moneyDto);
  }

  @Patch('/change-password')
  changePassword(@Body() passwordDto: PasswordDto) {
    return this.usersService.changePassword(passwordDto);
  }

  @Patch('/change-info')
  changeInfo(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.changeInfo(updateUserDto);
  }

  @Patch('/block/:id')
  block(@Param('id') id: string) {
    return this.usersService.block(id);
  }

  @Post('/delete-user')
  remove(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.remove(deleteUserDto);
  }
}
