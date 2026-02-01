import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategriesService } from './categries.service';
import { CreateCategryDto } from './dto/create-categry.dto';
import { UpdateCategryDto } from './dto/update-categry.dto';

@Controller('categries')
export class CategriesController {
  constructor(private readonly categriesService: CategriesService) {}

  @Post()
  create(@Body() createCategryDto: CreateCategryDto) {
    return this.categriesService.create(createCategryDto);
  }

  @Get()
  findAll() {
    return this.categriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategryDto: UpdateCategryDto) {
    return this.categriesService.update(+id, updateCategryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categriesService.remove(+id);
  }
}
