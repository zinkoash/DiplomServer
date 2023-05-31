import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ControlService } from './control.service';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Post()
  @UseInterceptors(FileInterceptor('data'))
  create(@Body() createControlDto: CreateControlDto,  @UploadedFile() data) {
    return this.controlService.create(createControlDto, data);
  }

  @Get()
  findAll() {
    return this.controlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.controlService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateControlDto: UpdateControlDto) {
    return this.controlService.update(+id, updateControlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.controlService.remove(+id);
  }
}
