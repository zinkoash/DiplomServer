import { Module } from '@nestjs/common';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Practice } from './practice.model';
import { FilesModule } from 'src/files/files.module';
import { PracticeFile } from './practice-file.model';
import { Variant } from './variant.model';
import { VariantFile } from './variant-file.model';
import { PracticeVariant } from './practice-variant.model';

@Module({
  imports:[
    SequelizeModule.forFeature([
      Practice,
      PracticeFile,
      Variant,
      VariantFile,
      PracticeVariant
    ]),
    FilesModule
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports:[PracticeService]

})
export class PracticeModule {}
