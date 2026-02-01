import { Injectable } from '@nestjs/common';
import { CreateCategryDto } from './dto/create-categry.dto';
import { UpdateCategryDto } from './dto/update-categry.dto';

@Injectable()
export class CategriesService {
  create(createCategryDto: CreateCategryDto) {
    return 'This action adds a new categry';
  }

  findAll() {
    return `This action returns all categries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categry`;
  }

  update(id: number, updateCategryDto: UpdateCategryDto) {
    return `This action updates a #${id} categry`;
  }

  remove(id: number) {
    return `This action removes a #${id} categry`;
  }
}
