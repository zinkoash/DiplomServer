import { Body, Controller, Get, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-students.dto';
import { CreateResultDto } from './dto/create-result.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('students')
export class StudentsController {
    constructor(private studentsService: StudentsService) { }

    @Get()
    getAllProfiles() {
        const students = this.studentsService.getAllStudents();
        return students;
    }
    @Post("create")
    create(@Body() studentDto: CreateStudentDto) {
        const student = this.studentsService.create(studentDto);
        return student;
    }
    @Post("addRes")
    @UseInterceptors(FileInterceptor('file'))
    addRes(@Body() resultDto:CreateResultDto, @UploadedFile() file:Express.Multer.File) {
        const result = this.studentsService.addResult(resultDto.userId, resultDto.practiceId, file, resultDto.description);
        return result;
    }
    @Post("addResultWithoutFile")
    addResWithOutFile(@Body() resultDto:CreateResultDto, @Body('status') status?:string) {
        const result = this.studentsService.addResWithOutFile(resultDto, status);
        return result;
    }

    @Get('results/')
    async getResultForUserByPractice(@Query('practiceNumber') practiceNumber?: number, @Query('userId') userId?:number){
        const result = await this.studentsService.getResultByUserAndPractice(userId, practiceNumber);
        return result
    }
    @Get('Allresults/')
    async getResultForUser( @Query('userId') userId?:number){
        const result = await this.studentsService.getResultsByUser(userId);
        return result
    }
    @Get('getStudent/')
    async getStudentByUserId(@Query('userId') userId?:number){
        const student = await this.studentsService.getStudentByUserId(userId);
        return student
    }

    @Patch('results/')
    @UseInterceptors(FileInterceptor('file'))
    async updateResultFile(@Query('practiceNumber') practiceId: number, @Query('userId') userId:number, @UploadedFile() file:Express.Multer.File ){
        const result = await this.studentsService.updateResultFile(userId, practiceId, file)
        return result
    }
    @Patch('results/status/')
    async updateResultStatus(@Query('practiceId') practiceId: number, @Query('userId') userId:number, @Body('status') status:string, @Body('description') description:string ){
        console.log(status);
        
        const result = await this.studentsService.updateResultStatusAndDescription(userId, practiceId, status, description)
        return result
    }
}
