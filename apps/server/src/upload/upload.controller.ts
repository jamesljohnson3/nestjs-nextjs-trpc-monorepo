import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
      // Configure Scaleway S3 client (AWS SDK version 3)

      const s3 = new S3Client({
        credentials: {
          accessKeyId: 'SCWYVGM43X872NJ79E5H', // Replace with your Scaleway access key
          secretAccessKey: 'f7f718d4-201e-44ae-bc51-38211ee6e22e', // Replace with your Scaleway secret key
        },
        region: 'fr-par', // Replace with your desired region
        endpoint: 'http://v1storage.unlimitednow.site.s3.fr-par.scw.cloud', // Scaleway S3 endpoint without http/https
      });

      // Upload the file to Scaleway S3 bucket
      const uploadParams = {
        Bucket: '', // Replace with your bucket name
        Key: file.originalname,
        Body: file.buffer,
      };

      const command = new PutObjectCommand(uploadParams);
      const uploadResponse = await s3.send(command);

      console.log('File uploaded to Scaleway:', uploadResponse);

      // Handle other logic, response, etc.

      return { message: 'File uploaded successfully' };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }
}
