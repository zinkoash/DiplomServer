import { Module, forwardRef } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './students.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Result } from './result.model';
import { File } from 'src/files/files.model';
import { StudentResult } from './student-result.model';
import { FilesModule } from 'src/files/files.module';
import { PracticeModule } from 'src/practice/practice.module';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports:[SequelizeModule.forFeature([
    Student,
    Result,
    File,
    StudentResult,

  ]),
    FilesModule,
    PracticeModule,
    JwtModule,
    forwardRef(()=>AuthModule)],
  exports:[StudentsService]
})
export class StudentsModule {}
