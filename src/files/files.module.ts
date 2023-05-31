import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { S3Module } from 'src/S3/S3.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './files.model';

@Module({
  imports:[S3Module,
    SequelizeModule.forFeature([
      File
    ]),
  ],
  providers: [FilesService],
  exports:[FilesService]
})
export class FilesModule {}
