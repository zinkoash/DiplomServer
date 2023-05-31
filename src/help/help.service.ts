import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHelpDto } from './dto/create-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Help } from './help.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class HelpService {

  constructor(@InjectModel(Help) private helpRepository: typeof Help,
  private fileService: FilesService){}


  async create(createHelpDto: CreateHelpDto, data:Express.Multer.File) {
    try {
      const file = await this.fileService.createFile(data,'control')
      if ('id' in file) {
        const help = await this.helpRepository.create({...createHelpDto , fileId:file.id});
        return help;
      }
    } catch (error) {
      throw new HttpException(`Ошибка записи файла ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return this.helpRepository.findAll({include:{all:true}});
  }

  findOne(id: number) {
    return this.helpRepository.findOne({where:{id}, include:{all:true}});
  }

  async updateHelpFile(helpId: number, newFile: Express.Multer.File) {
    const help = await this.helpRepository.findByPk(helpId)
    const newFileModel = await this.fileService.updateFile(help.fileId, newFile)
    await this.helpRepository.update(
      {
        file: newFileModel,
      },
      {
        where: { id: help.id },
      }
    )
    return await this.helpRepository.findByPk(helpId, { include: { all: true } })
  }
  async updateNameDescription(controlId:number, dto:CreateHelpDto) {
    
    const help = await this.helpRepository.findByPk(controlId)

    help.set({
      description: dto.description,
      name: dto.name,
    })
    const newRes = await help.save() 
        return newRes
  }
  async remove(id: number) {
    const control = await this.helpRepository.findByPk(id);
    await this.fileService.deleteFile(control.fileId)
    await this.helpRepository.destroy({where:{id}})
    return `This action removes a #${id} control`;
  }

}
