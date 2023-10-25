import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpService } from '@nestjs/axios';

@Controller('website')
export class WebsiteController {
  private readonly webhookUrl =
    'https://celonis-88gmud.eu-1.celonis.cloud/ems-automation/public/api/root/8c61ab66-8aa9-4ec2-94df-860a9d5a0270/hook/lue0r8e0j1u2umuy7n0fbany88wsbs16';

  constructor(private readonly httpService: HttpService) {}

  @Post()
  async uploadSitedata(@Body() data: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(this.webhookUrl, data)
        .toPromise();

      if (response) {
        return response.data;
      } else {
        throw new Error('No response received from the webhook endpoint');
      }
    } catch (error) {
      throw new Error('Error communicating with webhook endpoint');
    }
  }
}

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

      // Generate a unique filename using timestamp and original file extension
      const uniqueFilename = `${Date.now()}${extname(file.originalname)}`;

      // Upload the file to Scaleway S3 bucket
      const uploadParams = {
        Bucket: 'v1storage.unlimitednow.site', // Replace with your bucket name
        Key: uniqueFilename,
        Body: file.buffer,
      };

      // Use the PutObjectCommand to upload the file
      const command = new PutObjectCommand(uploadParams);
      const uploadResponse = await s3.send(command);

      console.log('File uploaded to Scaleway:', uploadResponse);

      // Return a success message
      return {
        message: 'File uploaded successfully',
        filename: uniqueFilename,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }
}
