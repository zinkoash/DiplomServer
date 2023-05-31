import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './files.model';

@Module({
  imports:[
    SequelizeModule.forFeature([
      File
    ]),
  ],
  providers: [FilesService],
  exports:[FilesService]
})
export class FilesModule {}
