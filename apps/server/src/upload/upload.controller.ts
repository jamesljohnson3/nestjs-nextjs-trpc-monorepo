import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      // Configure Scaleway S3 client (AWS SDK version 3)
      const s3 = new S3Client({
        credentials: {
          accessKeyId: 'SCWYVGM43X872NJ79E5H', // Replace with your Scaleway access key
          secretAccessKey: 'f7f718d4-201e-44ae-bc51-38211ee6e22e', // Replace with your Scaleway secret key
        },
        region: 'fr-par', // Replace with your desired region
        endpoint: 'https://s3.fr-par.scw.cloud', // Correct Scaleway S3 endpoint
      });

      // Upload the file to Scaleway S3 bucket
      const uploadParams = {
        Bucket: 'v1storage.unlimitednow.site', // Replace with your bucket name
        Key: `${Date.now()}${extname(file.originalname)}`, // Using a timestamp as the filename
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
