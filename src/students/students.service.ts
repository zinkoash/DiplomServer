import { FilesService } from 'src/files/files.service';
import { Injectable } from '@nestjs/common';
import { Student } from './students.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStudentDto } from './dto/create-students.dto';
import { Result } from './result.model';
import { PracticeService } from 'src/practice/practice.service';
import { CreateResultDto } from './dto/create-result.dto';

@Injectable()
export class StudentsService {
    
    constructor(@InjectModel(Student) private studentRepository: typeof Student,
        @InjectModel(Result) private resultRepository: typeof Result, private fileServise:FilesService, private practiceService:PracticeService
    ) { }

    async create(dto: CreateStudentDto) {
        const student = await this.studentRepository.create(dto);
        return student;
    }
    async getStudentByUserId(id: number) {
        const student = await this.studentRepository
            .findOne({ where: { userId:id }, include: { all: true } });
        return student;
    }
    async update(userId:number,studentDto: CreateStudentDto) {
        const profile = await this.getStudentByUserId(userId);
        return profile.update(studentDto);
    }
    async delete(userId: number) {
        const student = await this.studentRepository.destroy({ where: { userId } });
        return student;
    }
    async getAllStudents() {
        const students = await this.studentRepository.findAll({ include: { all: true } });
        return students;
    }
    async addResult(userId:number, practiceId:number, file:Express.Multer.File, description:string ){
        const student = await this.getStudentByUserId(userId)
        const practice = await this.practiceService.getPracticeById(practiceId)
        const resultFile = await this.fileServise.createFile(file, `results/${student.surname} ${student.name}/pr${practice.number}`)
        if ('id' in resultFile) {
            const result = await this.resultRepository.create({
                description:description,
                practiceId:practiceId,
                fileId:resultFile.id,
                studentId:student.id
            })
            student.$add('results', result.id)
        }
    }
    async addResWithOutFile(resultDto: CreateResultDto, status?:string) {
        const student = await this.getStudentByUserId(resultDto.userId)
        // const practice = await this.practiceService.getPracticeById(resultDto.practiceId)
        const result = await this.resultRepository.create({
            description:resultDto.description,
            practiceId:resultDto.practiceId,
            studentId:student.id,
            status:status
        })
        student.$add('results', result.id)
        return result
    }
    async getResultByUserAndPractice(userId:number, practiceId:number){
        const student = await this.getStudentByUserId(userId)
        const results = await this.resultRepository.findOne({
            where:{
                practiceId:practiceId,
                studentId:student.id
            },
            include:{
                all:true
            }
        })
        return results
    }
    async getResultsByUser(userId:number){
        const student = await this.getStudentByUserId(userId)
        const results = await this.resultRepository.findAll({
            where:{
                studentId:student.id
            },
            include:{
                all:true
            }
        })
        return results
    }
    async updateResultFile(userId:number, practiceId:number, newFile:Express.Multer.File){
        const result = await this.getResultByUserAndPractice(userId, practiceId)
        const newFileModel = await this.fileServise.updateFile(result.fileId, newFile)
        await this.resultRepository.update(
            {
                file: newFileModel,
                status: "Проверка"
            },
            {
                where: { id: result.id },
            }
        )
        return await this.resultRepository.findByPk(result.id,{include:{all:true}})
    }
    async updateResultStatusAndDescription(userId:number, practiceId:number, status:string, description:string){
        const result = await this.getResultByUserAndPractice(userId, practiceId)
        result.set({
            description: description,
            status: status
        })

        const newRes = await result.save()
        console.log(newRes);
        
        return newRes
    }
}
