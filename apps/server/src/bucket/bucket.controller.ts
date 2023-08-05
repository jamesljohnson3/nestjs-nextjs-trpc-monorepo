import { Controller, Post, Body } from '@nestjs/common';
import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';

@Controller('buckets')
export class BucketController {
  @Post()
  async createBucket(@Body() body: { bucketName: string }) {
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

      // Create a new bucket
      const createBucketParams = {
        Bucket: body.bucketName,
      };

      const command = new CreateBucketCommand(createBucketParams);
      const createBucketResponse = await s3.send(command);

      console.log('Bucket created:', createBucketResponse);

      // Handle other logic, response, etc.

      return { message: 'Bucket created successfully' };
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw new Error('Error creating bucket');
    }
  }
}
