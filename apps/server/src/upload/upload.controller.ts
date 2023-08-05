import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import axios from 'axios';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Explicitly provide the type
    const data = {
      filename: file.originalname,
      bucket: 'v1storage.unlimitednow.site',
    };

    try {
      // Upload to Scaleway bucket
      const response = await axios.post(
        'http://v1storage.unlimitednow.site.s3.fr-par.scw.cloud/v1/storage/v1storage.unlimitednow.site',
        file.buffer,
        {
          headers: {
            Authorization: `Bearer ${process.env.SCW_SECRET_KEY}`,
          },
        },
      );

      console.log('File uploaded to Scaleway:', response.data);

      // Send object details to another server (your Next.js frontend or another API)
      await axios.post(
        'https://accounts.nassawautobrokers.com/api/upload',
        data,
      );

      return { message: 'File uploaded and object details sent' };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }
}
