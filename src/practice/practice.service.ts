import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Practice } from './practice.model';
import { FilesService } from 'src/files/files.service';
import { File } from 'src/files/files.model';
import { PracticeFile } from './practice-file.model';
import * as path from 'path';
import * as fs from 'fs';
import { JSDOM } from 'jsdom';
import { Variant } from './variant.model';
import { VariantFile } from './variant-file.model';
import { PracticeVariant } from './practice-variant.model';
import { CreateVariantDto } from './dto/create-variant.dto';



@Injectable()
export class PracticeService {

    constructor(@InjectModel(Practice) private practiceRepository: typeof Practice, @InjectModel(PracticeFile) private practiceFileRepository: typeof PracticeFile,
        private fileService: FilesService, @InjectModel(Variant) private variantRepository: typeof Variant, @InjectModel(VariantFile) private variantFileRepository: typeof VariantFile,
        @InjectModel(PracticeVariant) private practiceVariantRepository: typeof PracticeVariant) { }


    async create(dto: CreatePracticeDto, data: Express.Multer.File, files?: Express.Multer.File[]) {
        const practiceFiles = await this.fileService.createFile(data, `practice/${data.originalname.split('.')[0]}`, files)
        if (practiceFiles instanceof Object && 'file' in practiceFiles) {
            const mainFile = practiceFiles.file;
            const additionalFiles = practiceFiles.files;

            // Создаем практическую работу с основным файлом
            const practice = await this.practiceRepository.create({
                ...dto,
                mainFileId: mainFile.id,
            });
            await this.practiceFileRepository.create({
                practiceId: practice.id,
                fileId: mainFile.id,
            });
            if (additionalFiles.length > 0) {
                await practice.$add('additionalFiles', additionalFiles.map((file) => file.id));
            }
            const practiceData = await this.transformPractice(practice)
            const variants: any[] = practiceData.variki


            variants.map(async (variant) => {
                await practice.$add('Variant', (await this.addVariants({ number: variant.number, practiceNumber: practice.number })).id)
            })

            return practice
        } else {
            const mainFile = practiceFiles;
            const practice = await this.practiceRepository.create({
                ...dto,
                mainFileId: mainFile.id,
            });
            return practice;
        }
    }

    async addVariants(dto: CreateVariantDto) {
        const variant = await this.variantRepository.create(dto)
        return variant
    }
    async addFileToVariant(files: Express.Multer.File[], id: number, prNum: number) {
        const variant = await Variant.findOne({ where: { id }, include: { all: true } })
        const practice = (await this.getPracticeByNumber(prNum)).practice
        const mainfile = await this.fileService.getFileById(practice.mainFileId)
        console.log(files);
        
        const folder = `practice/${mainfile.fileName.split('.')[0]}/variants/pr${prNum}var${variant.number}/pr${prNum}var${variant.number}.files`

        for (const file of files) {
            const fileN = await this.fileService.createFile(file, folder);
            if (fileN instanceof File) {
                await variant.$add('additionalFiles', fileN.id);
            }
        }
        return variant

    }
    async getAll() {
        const practices = await this.practiceRepository.findAll({ include: { all: true } })
        return practices;
    }

    async getPracticeByNumber(number: number) {
        const practice = await this.practiceRepository.findOne({ where: { number }, include: { all: true } })
        const practiceData = await this.transformPractice(practice)
        return { practice: practice, practiceData: practiceData }
    }
    async getPracticeById(id:number) {
        const practice = await this.practiceRepository.findOne({ where: { id }, include: { all: true } })
        return practice
    }

    async transformPractice(practice: Practice) {
        try {
            practice = await this.practiceRepository.findOne({ where: { number: practice.number }, include: { all: true } })
            const mainfile = await this.fileService.getFileById(practice.mainFileId)
            const filePath = path.join(__dirname, '..', '..', 'static', 'uploads', 'practice', mainfile.fileName.split('.')[0], mainfile.fileName)

            const text = fs.readFileSync(filePath, 'utf8');
            // console.log(text);

            const dom = new JSDOM(text)
            const container = dom.window.document.querySelector('.container');
            const variants = container.querySelectorAll('.work');
            const ArrFromVariants = [];
            const serverUrl = this.fileService.getServerURI();
            variants.forEach((element, index: number) => {
                const imgVariant = element.querySelectorAll('img')
                imgVariant.forEach(element => {
                    const img = element as HTMLImageElement;

                    const fileName = img.src.split('/').reverse()[0];
                    // Изменяем путь к изображению, добавляя fileId в URL
                    const newSrc = `${serverUrl}/uploads/practice/${mainfile.fileName.split('.')[0]}/variants/pr${practice.number}var${index+1}/pr${practice.number}var${index+1}.files/${fileName}`;
    
                    // Устанавливаем новый путь к изображению
                    img.src = newSrc;
                });
                ArrFromVariants.push({               //паша бусинка
                    number: index + 1,
                    variantBody: element.innerHTML
                })
            });
            variants.forEach(element => element.remove());
            const imgElements = container.querySelectorAll('img');
            imgElements.forEach((element) => {
                const img = element as HTMLImageElement;

                const fileName = img.src.split('/').reverse()[0];
                // Изменяем путь к изображению, добавляя fileId в URL
                const newSrc = `${serverUrl}/uploads/practice/${mainfile.fileName.split('.')[0]}/${mainfile.fileName.split('.')[0]}.files/${fileName}`;

                // Устанавливаем новый путь к изображению
                img.src = newSrc;
                console.log(newSrc);

            });
            const video:HTMLVideoElement = container.querySelector('video');
            console.log(video);
            
            if (video) {
                video.autoplay = false
                const VideoSource = video.querySelector('source')
                const fileName = VideoSource.src.split('/').reverse()[0];
                VideoSource.src = `${serverUrl}/uploads/practice/${mainfile.fileName.split('.')[0]}/${mainfile.fileName.split('.')[0]}.files/${fileName}`
            }
            const newDocument = {
                body: container.innerHTML,
                variki: ArrFromVariants
            }
            return newDocument
        }
        catch (e) {
            console.log(e);

            throw new HttpException('Произошла ошибка чтения файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async getVariantsForPractice(practiceNum: number) {
        const variants = (await this.practiceRepository.findOne({ where: { number: practiceNum }, include: Variant })).variants
        return variants;
    }
    async deleteVariant(variantId:number){
        const variant = await this.variantRepository.findOne({ where: { id: variantId }, include: {all:true} })
        if(variant.additionalFiles){
            for (const file of variant.additionalFiles) {
                await this.fileService.deleteFile(file.id)
            }
        }
        await this.variantRepository.destroy({where:{id:variantId}})

    }
    async deleteVariants(variants:Variant[]){
        for (const variant of variants) {
            await this.deleteVariant(variant.id)
        }
        
    }
    async remove(id: number) {
        const practice = await this.practiceRepository.findOne({ where: { id: id }, include: {all:true} });

        await this.fileService.deleteFolder(practice.mainFile.folder)
        await this.practiceFileRepository.destroy({where:{practiceId:id}})
        await this.practiceVariantRepository.destroy({where:{practiceId:id}})
        await this.practiceRepository.destroy({where:{id}})
        return `This action removes a #${id} theory`;
    }
    
}
