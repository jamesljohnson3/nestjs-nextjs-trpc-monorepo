import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as AWS from 'aws-sdk';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      // Configure AWS S3 client
      const s3 = new AWS.S3({
        accessKeyId: 'SCWYVGM43X872NJ79E5H', // Replace with your Scaleway access key
        secretAccessKey: 'f7f718d4-201e-44ae-bc51-38211ee6e22e', // Replace with your Scaleway secret key
        endpoint: 'https://v1storage.unlimitednow.site.s3.fr-par.scw.cloud', // Replace with your Scaleway endpoint
        region: 'fr-par', // Replace with your desired region
      });

      // Upload the file to Scaleway S3 bucket
      const uploadParams = {
        Bucket: 'v1storage.unlimitednow.site', // Replace with your bucket name
        Key: file.originalname,
        Body: file.buffer,
      };

      const uploadResponse = await s3.upload(uploadParams).promise();

      console.log('File uploaded to Scaleway:', uploadResponse);

      // Handle other logic, response, etc.

      return { message: 'File uploaded successfully' };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }
}
