import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { HelpService } from './help.service';
import { CreateHelpDto } from './dto/create-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Post()
  @UseInterceptors(FileInterceptor('data'))
  create(@Body() createHelpDto: CreateHelpDto,  @UploadedFile() data) {
    return this.helpService.create(createHelpDto, data);
  }

  @Get()
  findAll() {
    return this.helpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.helpService.findOne(+id);
  }

  @Patch('patchFile/')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(@Query('helpId') helpId: number, @UploadedFile() file: Express.Multer.File) {
    const result = await this.helpService.updateHelpFile(helpId, file)
    return result
  }
  @Patch('patchDescription/')
  async updateDescription(@Query('helpId') helpId: number, @Body() dto:CreateHelpDto) {
    const help = await this.helpService.updateNameDescription(helpId, dto)
    return help
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.helpService.remove(+id);
  }
}
