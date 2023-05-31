import { Module } from '@nestjs/common';
import { TheoryService } from './theory.service';
import { TheoryController } from './theory.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Theory } from './theory.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports:[
    SequelizeModule.forFeature([
      Theory
    ]),
    FilesModule
  ],
  controllers: [TheoryController],
  providers: [TheoryService]
})
export class TheoryModule {}
