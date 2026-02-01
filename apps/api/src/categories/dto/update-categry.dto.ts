import { PartialType } from '@nestjs/mapped-types';
import { CreateCategryDto } from './create-categry.dto';

export class UpdateCategryDto extends PartialType(CreateCategryDto) {}
