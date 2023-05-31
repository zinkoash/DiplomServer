import { Module } from '@nestjs/common';
import { ControlService } from './control.service';
import { ControlController } from './control.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Control } from './control.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports:[
    SequelizeModule.forFeature([
      Control
    ]),
    FilesModule
  ],
  controllers: [ControlController],
  providers: [ControlService]
})
export class ControlModule {}
