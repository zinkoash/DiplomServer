import { CreatePracticeDto } from './dto/create-practice.dto';
import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors, UploadedFiles, Query, Delete } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateDirDto } from './dto/create-dir.dto';

@Controller('practice')
export class PracticeController {

    constructor(private practiceService:PracticeService){

    }

    
    @Post()
        @UseInterceptors(FileFieldsInterceptor([
          {name:'data', maxCount:1},
          {name:'files[]'}
        ]))
        create(@Body() dto: CreatePracticeDto, @UploadedFiles() files:{data:Express.Multer.File[], 'files[]':Express.Multer.File[]}) {
            console.log(files);
            
        return this.practiceService.create(dto, files.data[0], files["files[]"]);
    }
    @Post('/addVariantFiles')
        @UseInterceptors(FilesInterceptor('data[]'))
        addVariantFiles(@Body('id') variantId: number,
        @Body('practiceNum') practiceNum: number, @UploadedFiles() data:Express.Multer.File[]) {
            console.log(data);
            
        return  this.practiceService.addFileToVariant(data,variantId, practiceNum)
    }
    
    @Get()
    getAllPractice(){
        return this.practiceService.getAll();
    }
    @Get('variants/')
    async getAllVariantForPractice(@Query('practiceNumber') practiceNumber?: number){
        const variants = await this.practiceService.getVariantsForPractice(practiceNumber);
        return variants 
    }
    @Get('/:number')
    getPracticeById(@Param('number') number: number){
        return this.practiceService.getPracticeByNumber(number);
    }
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.practiceService.remove(+id);
    }
}
