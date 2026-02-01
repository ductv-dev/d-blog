import { Module } from '@nestjs/common';
import { CategriesService } from './categries.service';
import { CategriesController } from './categries.controller';

@Module({
  controllers: [CategriesController],
  providers: [CategriesService],
})
export class CategriesModule {}
