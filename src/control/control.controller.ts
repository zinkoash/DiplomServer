import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
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

  @Patch('patchFile/')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(@Query('controlId') controlId: number, @UploadedFile() file: Express.Multer.File) {
    const result = await this.controlService.updateControlFile(controlId, file)
    return result
  }
  @Patch('patchDescription/')
  async updateDescription(@Query('controlId') controlId: number, @Body() dto:CreateControlDto) {
    const control = await this.controlService.updateNameDescription(controlId, dto)
    return control
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.controlService.remove(+id);
  }
}
