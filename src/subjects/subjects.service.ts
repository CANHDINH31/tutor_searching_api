import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject } from 'src/schemas/subjects.schema';
import { StringDecoder } from 'string_decoder';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModal: Model<Subject>,
  ) {}
  async create(createSubjectDto: CreateSubjectDto) {
    try {
      const data = await this.subjectModal.create({ ...createSubjectDto });
      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới môn học thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.subjectModal.find({ is_delete: false });
      return {
        status: HttpStatus.OK,
        message: 'Lấy danh sách môn học thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    try {
      const data = await this.subjectModal.findByIdAndUpdate(
        id,
        { ...updateSubjectDto },
        { new: true },
      );
      return {
        status: HttpStatus.OK,
        message: 'Cập nhật môn học thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id: string) {
    try {
      await this.subjectModal.findByIdAndUpdate(id, { is_delete: true });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.subjectModal.findByIdAndRemove(id);
      return {
        status: HttpStatus.OK,
        message: 'Xóa môn học thành công',
      };
    } catch (error) {
      throw error;
    }
  }
}
