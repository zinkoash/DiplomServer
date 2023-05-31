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

  remove(id: number) {
    return `This action removes a #${id} control`;
  }
}
