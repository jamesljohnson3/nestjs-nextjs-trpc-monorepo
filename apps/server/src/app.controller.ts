import { Controller, Get, Post, Body, Headers, Query } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

interface ApiResponse {
  message: string;
  key: string;
  isValid: boolean;
  webhookResponseData?: any[]; // Change this to the desired type
}
interface PostData {
  field1: string;
  field2: string;
  // Add more fields as needed
}
@Controller('actions')
export class AppController {
  private readonly allowedUUID = '22-22-22'; // Replace with your authorized UUID
  private webhookUrl =
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e'; // Replace this with your actual webhook URL
  private webhookUrl2 =
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/acgonuudtu441k97whj3xp8ykm9pme2s'; // Replace this with your second webhook URL
  private webhookUrl3 =
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/30sskndje19f0ws6ablrfbfujra8qr89'; // Replace this with your third webhook URL

  constructor(private httpService: HttpService) {}

  private isValidUUID(uuid: string): boolean {
    // Validate the provided UUID here (e.g., using a library like "uuid")
    // Return true if the UUID is valid, otherwise return false
    // Replace the example validation logic below with your actual validation logic
    return uuid === this.allowedUUID;
  }

  @Get() // Handles GET requests to /actions
  async getAction(
    @Headers('authorization') authorizationHeader: string,
    @Query('uuid') uuid: string,
    @Query('field1') field1: string,
    @Query('field2') field2: string,
  ): Promise<ApiResponse> {
    const authorizedUUID = authorizationHeader?.split(' ')[1];

    if (!authorizedUUID || !this.isValidUUID(authorizedUUID)) {
      return { message: 'Unauthorized', isValid: false, key: 'null' };
    }

    const response: ApiResponse = {
      message: 'Hello, World!',
      isValid: true,
      key: '123456789',
    };
    console.log('UUID:', uuid);
    console.log('Field 1:', field1);
    console.log('Field 2:', field2);

    try {
      // Fetch data from the webhook endpoints using Promise.all to handle multiple requests simultaneously
      const [webhookResponse1, webhookResponse2, webhookResponse3] =
        await Promise.all([
          this.httpService
            .post(this.webhookUrl, {
              key: 'content',
              field1,
              field2 /* Add more fields as needed */,
            })
            .toPromise(),
          this.httpService
            .post(this.webhookUrl2, {
              key: 'content',
              field1,
              field2 /* Add more fields as needed */,
            })
            .toPromise(),
          this.httpService
            .post(this.webhookUrl3, {
              key: 'content',
              field1,
              field2 /* Add more fields as needed */,
            })
            .toPromise(),
        ]);

      if (webhookResponse1 && webhookResponse2 && webhookResponse3) {
        console.log('Webhook response 1:', webhookResponse1.data);
        console.log('Webhook response 2:', webhookResponse2.data);
        console.log('Webhook response 3:', webhookResponse3.data);

        // Populate the webhookResponseData array with the data received from the webhook endpoint
        response.webhookResponseData = [
          webhookResponse1.data,
          webhookResponse2.data,
          webhookResponse3.data,
        ];
      } else {
        console.error('Webhook request failed');
        response.webhookResponseData = []; // Set webhookResponseData to an empty array in case of an error
      }
    } catch (error) {
      console.error('Error fetching data from webhook:', error.message);
      response.webhookResponseData = []; // Set webhookResponseData to an empty array in case of an error
    }

    return response;
  }

  @Post() // Handles POST requests to /actions
  async postAction(
    @Headers('authorization') authorizationHeader: string,
    @Body() body: PostData, // Specify the type of the 'body' parameter
  ): Promise<ApiResponse> {
    const authorizedUUID = authorizationHeader?.split(' ')[1];

    if (!authorizedUUID || !this.isValidUUID(authorizedUUID)) {
      return { message: 'Unauthorized', isValid: false, key: 'null' };
    }
    const { field1, field2 /* Add more fields as needed */ } = body;

    const response: ApiResponse = {
      message: 'Hello, World!',
      isValid: true,
      key: '123456789',
    };

    try {
      // Fetch data from the webhook endpoints using Promise.all to handle multiple requests simultaneously
      const [webhookResponse1, webhookResponse2, webhookResponse3] =
        await Promise.all([
          this.httpService
            .post(this.webhookUrl, {
              key: 'content',
              field1,
              field2 /* Add more fields as needed */,
            })
            .toPromise(),
          this.httpService
            .post(this.webhookUrl2, {
              key: 'content',
              field1,
              field2 /* Add more fields as needed */,
            })
            .toPromise(),
          this.httpService
            .post(this.webhookUrl3, {
              key: 'content',
              field1,
              field2 /* Add more fields as needed */,
            })
            .toPromise(),
        ]);

      if (webhookResponse1 && webhookResponse2 && webhookResponse3) {
        console.log('Webhook response 1:', webhookResponse1.data);
        console.log('Webhook response 2:', webhookResponse2.data);
        console.log('Webhook response 3:', webhookResponse3.data);

        // Populate the webhookResponseData array with the data received from the webhook endpoint
        response.webhookResponseData = [
          webhookResponse1.data,
          webhookResponse2.data,
          webhookResponse3.data,
        ];
      } else {
        console.error('Webhook request failed');
        response.webhookResponseData = []; // Set webhookResponseData to an empty array in case of an error
      }
    } catch (error) {
      console.error('Error fetching data from webhook:', error.message);
      response.webhookResponseData = []; // Set webhookResponseData to an empty array in case of an error
    }

    return response;
  }
}
