import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { TheoryService } from './theory.service';
import { CreateTheoryDto } from './dto/create-theory.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('theory')
export class TheoryController {
  constructor(private readonly theoryService: TheoryService) { }

  @Post()
  @UseInterceptors(FileInterceptor('data'))
  create(@Body() createTheoryDto: CreateTheoryDto, @UploadedFile() data) {
    return this.theoryService.create(createTheoryDto, data);
  }

  @Get()
  findAll() {
    return this.theoryService.findAll();
  }

  @Get('/:number')
  findOne(@Param('number') number: number) {
    console.log(number);

    return this.theoryService.findOne(+number);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTheoryDto: UpdateTheoryDto) {
  //   return this.theoryService.update(+id, updateTheoryDto);
  // }
  @Patch('patchFile/')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(@Query('theoryId') theoryId: number, @UploadedFile() file: Express.Multer.File) {
    const result = await this.theoryService.updateTheoryFile(theoryId, file)
    return result
  }
  @Patch('patchDescription/')
  async updateDescription(@Query('theoryId') theoryId: number, @Body() dto:CreateTheoryDto) {
    console.log(dto);

    const theory = await this.theoryService.updateNameNumberDescription(theoryId, dto)
    return theory
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.theoryService.remove(+id);
  }
}


