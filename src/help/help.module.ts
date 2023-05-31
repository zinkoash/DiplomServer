import { Module } from '@nestjs/common';
import { HelpService } from './help.service';
import { HelpController } from './help.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Help } from './help.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports:[
    SequelizeModule.forFeature([
      Help
    ]),
    FilesModule
  ],
  controllers: [HelpController],
  providers: [HelpService]
})
export class HelpModule {}
