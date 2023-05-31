import { HttpException, HttpStatus, Injectable, Body, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import * as path from 'path';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { S3Service } from 'src/S3/S3.service';
import { InjectModel } from '@nestjs/sequelize';
import { File } from './files.model';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as mammoth from 'mammoth';

@Injectable()
export class FilesService {
    constructor(@InjectModel(File) private fileReposiroty: typeof File, private s3Service: S3Service, @Inject(REQUEST) private readonly request: Request) { }
    getServerURI() {
        const serverUrl = `${this.request.protocol}://${this.request.get('host')}`;
        return serverUrl;
    }
    async createFile(file: Express.Multer.File, folder: string, assets?: Express.Multer.File[]) {
        try {
            file.originalname = Buffer.from(file.originalname, 'latin1').toString(
                'utf8',
            );
            const staticPath = path.resolve(__dirname, '..', '..', 'static', 'uploads')
            const fileName = file.originalname.split('.')[0]
            const folderPath = path.resolve(staticPath, folder)
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true })
            }
            if (assets) {
                assets.map(el=>el.originalname = Buffer.from(el.originalname, 'latin1').toString(
                    'utf8',
                ));
                const filesDir = path.join(folderPath, fileName + '.files')
                if (!fs.existsSync(filesDir)) {
                    fs.mkdirSync(filesDir, { recursive: true })
                }
                fs.writeFileSync(path.join(folderPath, file.originalname), file.buffer)
                const File = await this.fileReposiroty.create({ fileName: file.originalname, folder: folder })
                assets.map(el => fs.writeFileSync(path.join(filesDir, el.originalname), el.buffer))
                const Files: File[] = []
                assets.map(async el => Files.push(await this.fileReposiroty.create({ fileName: el.originalname, folder: fileName + '.files' })))
                return {
                    file: File,
                    files: Files
                }
            }
            else {
                fs.writeFileSync(path.join(staticPath, folder, file.originalname), file.buffer)
                const File = await this.fileReposiroty.create({ fileName: file.originalname, folder: folder })
                return File;
            }
        } catch (error) {
            console.log(error)
            throw new HttpException('Произошла ошибка записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    // async AddFiles(files:Express.Multer.File|Express.Multer.File[], folder:string){
    //     const staticPath = path.resolve(__dirname, '..', '..', 'static', 'uploads')
    //     const folderPath = path.resolve(staticPath, folder)


    // }
    async getOneFileUrl(fileName: string, folder: string) {
        try {
            const serverUrl = this.getServerURI();
            const fileUrl = `${serverUrl}/uploads/${folder}/${fileName}`
            return fileUrl;
        } catch (error) {
            throw new HttpException('Произошла ошибка чтения файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async tranformFiles(fileUrl: string) {
        console.log(fileUrl);

        const resp = await axios.get(fileUrl, { responseType: 'arraybuffer' })
        console.log(resp);
        const result = await mammoth.convertToHtml({ buffer: resp.data })
        const html = result.value
        console.log(html);

        return html
    }
    async getFromFile(fileName: string): Promise<object | any> {
        try {
            const filePath = path.join(__dirname, '..', 'static/uploads', fileName)
            console.log(filePath);

            const text = fs.readFileSync(filePath);
            console.log(text.toString());


            // const variants = container.querySelectorAll('.work');
            // const ArrFromVariants = [];
            // variants.forEach((element,index:number) => ArrFromVariants.push({
            //     number:index+1,
            //     variantBody:element.innerHTML
            // }));
            // variants.forEach(element => element.remove());
            // const newDocument = {
            //     body:container.innerHTML,
            //     variki:ArrFromVariants
            // }
            return text.toString()
        }
        catch (e) {
            console.log(e);

            throw new HttpException('Произошла ошибка чтения файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async getFileById(id: number) {
        return await this.fileReposiroty.findOne({ where: { id: id } })
    }
    async deleteFile(id: number) {
        const file = await this.getFileById(id)
        const staticPath = path.resolve(__dirname, '..', '..', 'static', 'uploads')
        const filePath = path.join(staticPath, file.folder, file.fileName)

        fs.unlink(filePath, err => {
            if (err) throw err; // не удалось удалить файл
            console.log('Файл успешно удалён')
        })
        return await this.fileReposiroty.destroy({ where: { id: id } })
    }
    async deleteFolder(folder:string){
        fs.rmdir( path.join(__dirname, '..', '..', 'static', 'uploads', folder), 
          { recursive:true }, 
          (err) => { 
            console.error(err); 
          }
        );
    }
    async updateFile(id: number, newFile: Express.Multer.File) {
        newFile.originalname = Buffer.from(newFile.originalname, 'latin1').toString(
            'utf8',
        );
        const file = await this.getFileById(id)
        const staticPath = path.resolve(__dirname, '..', '..', 'static', 'uploads')
        const filePath = path.join(staticPath, file.folder, file.fileName)
        fs.unlink(filePath, err => {
            if (err) throw err; // не удалось удалить файл
            console.log('Файл успешно удалён')
        })
        fs.writeFileSync(path.join(staticPath, file.folder, newFile.originalname), newFile.buffer)
        await this.fileReposiroty.update(
            {
                fileName: newFile.originalname,
            },
            {
                where: { id: id },
            }
        )
        return await this.getFileById(id)
    }
}
