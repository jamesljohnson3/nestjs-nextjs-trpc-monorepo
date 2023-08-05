import { Controller, Post, Body } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Controller('upload')
export class UploadController {
  @Post()
  async uploadFile(@Body() body: { file: Buffer; filename: string }) {
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
        Key: body.filename, // Use the provided filename
        Body: body.file,
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
