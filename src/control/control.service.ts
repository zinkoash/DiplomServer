import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Control } from './control.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ControlService {

  constructor(@InjectModel(Control) private controlRepository: typeof Control,
  private fileService: FilesService){}

  async create(createControlDto: CreateControlDto, data:Express.Multer.File) {
    try {
      const file = await this.fileService.createFile(data,'control')
      if ('id' in file) {
        const control = await this.controlRepository.create({...createControlDto , fileId:file.id});
        return control;
      }
    } catch (error) {
      throw new HttpException(`Ошибка записи файла ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return this.controlRepository.findAll({include:{all:true}});
  }

  findOne(id: number) {
    return this.controlRepository.findOne({where:{id}, include:{all:true}});
  }

  update(id: number, updateControlDto: UpdateControlDto) {
    return `This action updates a #${id} control`;
  }
  async updateControlFile(controlId: number, newFile: Express.Multer.File) {
    const control = await this.controlRepository.findByPk(controlId)
    const newFileModel = await this.fileService.updateFile(control.fileId, newFile)
    await this.controlRepository.update(
      {
        file: newFileModel,
      },
      {
        where: { id: control.id },
      }
    )
    return await this.controlRepository.findByPk(controlId, { include: { all: true } })
  }
  async updateNameDescription(controlId:number, dto:CreateControlDto) {
    
    const control = await this.controlRepository.findByPk(controlId)

    control.set({
      description: dto.description,
      name: dto.name,
    })
    const newRes = await control.save() 
        return newRes
  }
  async remove(id: number) {
    const control = await this.controlRepository.findByPk(id);
    await this.fileService.deleteFile(control.fileId)
    await this.controlRepository.destroy({where:{id}})
    return `This action removes a #${id} control`;
  }
}
