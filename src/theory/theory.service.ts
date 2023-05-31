import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTheoryDto } from './dto/create-theory.dto';
import { FilesService } from 'src/files/files.service';
import { Theory } from './theory.model';
import { InjectModel } from '@nestjs/sequelize';
import { File } from 'src/files/files.model';

@Injectable()
export class TheoryService {
  constructor(@InjectModel(Theory) private theoryRepository: typeof Theory,
  private fileService: FilesService){}

  async create(createTheoryDto: CreateTheoryDto, data:Express.Multer.File) {
    console.log(data);
    
    const existingTheory = await this.theoryRepository.findOne({
      where: { number: createTheoryDto.number },
    });
    if (existingTheory) {
      throw new HttpException(
        `Номер ${createTheoryDto.number} уже существует`,
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const file = await this.fileService.createFile(data,'theory')
      if (file instanceof File) {
        const theory = await this.theoryRepository.create({...createTheoryDto , fileId:file.id});
        return theory;
      }
    } catch (error) {
      throw new HttpException(`Ошибка записи файла ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return this.theoryRepository.findAll({include:{all:true}});
  }

  async findOne(number: number) {
    
    const theory = await this.theoryRepository.findOne({where:{number}, include:{all:true}})
    const theoryUrl = await this.fileService.getOneFileUrl(theory.file.fileName, 'theory');
    const theoryHtml = await this.fileService.tranformFiles(theoryUrl)
    return {theory:theory, theoryHtml:theoryHtml, theoryUrl:theoryUrl}
  }

  // update(id: number, updateTheoryDto: UpdateTheoryDto) {
  //   return `This action updates a #${id} theory`;
  // }
  async updateTheoryFile(theoryId: number, newFile: Express.Multer.File) {
    const theory = await this.theoryRepository.findByPk(theoryId)
    // const file = await this.fileService.getFileById(theory.fileId)
    const newFileModel = await this.fileService.updateFile(theory.fileId, newFile)
    await this.theoryRepository.update(
      {
        file: newFileModel,
      },
      {
        where: { id: theory.id },
      }
    )
    return await this.theoryRepository.findByPk(theoryId, { include: { all: true } })
  }

  async updateNameNumberDescription(theoryId:number, dto:CreateTheoryDto) {
    console.log(dto.number);
    
    const theory = await this.theoryRepository.findByPk(theoryId)
    const innerTheory = await this.theoryRepository.findOne({where:{number:dto.number}})
  
    if (innerTheory&& (innerTheory.id !== theory.id)) {
      throw new HttpException(`Теория с таким номером существует`, HttpStatus.BAD_REQUEST);
    }
    theory.set({
      description: dto.description,
      name: dto.name,
      number:dto.number,
    })
    const newRes = await theory.save() 
        return newRes
  }
  async remove(id: number) {
    const theory = await this.theoryRepository.findByPk(id);
    await this.fileService.deleteFile(theory.fileId)
    await this.theoryRepository.destroy({where:{id}})
    return `This action removes a #${id} theory`;
  }
}
