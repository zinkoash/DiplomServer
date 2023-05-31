import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
    this.s3 = new AWS.S3();
  }

  async uploadToS3(file: any, folderName: string): Promise<string> {
    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: process.env.BUCKET_NAME,
      Key: `static/${folderName}/${file.originalname}`,
      Body: file.buffer,
    };
    const data = await this.s3.upload(params).promise();
    return data.Location;
  }
  async getUriFromS3(fileName:string, folderName: string):Promise<string>{
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${folderName}/${fileName}`,
        Expires: 60 * 60,
    }
    const signedUrl = await this.s3.getSignedUrlPromise('getObject', params);
    return signedUrl;
  }
  async getFromS3(fileName:string, folderName: string){
    const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${folderName}/${fileName}`,
    }
    const data = await this.s3.getObject(getObjectParams).promise();
    return data.Body;
  }
  async deleteFromS3(fileUrl: string) {
    const key = fileUrl.replace('https://s3.amazonaws.com/', '');
    const params: AWS.S3.Types.DeleteObjectRequest = {
      Bucket: 'BUCKET_NAME',
      Key: key,
    };
    await this.s3.deleteObject(params).promise();
  }
}
