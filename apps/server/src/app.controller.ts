import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

interface ApiResponse {
  message: string;
  key: string;
  isValid: boolean;
  webhookResponseData?: any[]; // Change this to the desired type
}

@Controller('actions')
export class AppController {
  private readonly allowedUUID = '22-22-22'; // Replace with your authorized UUID
  private webhookUrl =
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e'; // Replace this with your actual webhook URL

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

    try {
      // Fetch data from the webhook endpoint using Promise.all to handle multiple requests simultaneously
      const [webhookResponse1, webhookResponse2] = await Promise.all([
        this.httpService.post(this.webhookUrl, { key: 'content' }).toPromise(),
        this.httpService.post(this.webhookUrl, { key: 'content2' }).toPromise(),
      ]);

      if (webhookResponse1 && webhookResponse2) {
        console.log('Webhook response 1:', webhookResponse1.data);
        console.log('Webhook response 2:', webhookResponse2.data);

        // Populate the webhookResponseData array with the data received from the webhook endpoint
        response.webhookResponseData = [
          webhookResponse1.data,
          webhookResponse2.data,
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
    @Body() body: any,
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

    try {
      // Fetch data from the webhook endpoint using Promise.all to handle multiple requests simultaneously
      const [webhookResponse1, webhookResponse2] = await Promise.all([
        this.httpService.post(this.webhookUrl, { key: 'content' }).toPromise(),
        this.httpService.post(this.webhookUrl, { key: 'content2' }).toPromise(),
      ]);

      if (webhookResponse1 && webhookResponse2) {
        console.log('Webhook response 1:', webhookResponse1.data);
        console.log('Webhook response 2:', webhookResponse2.data);

        // Populate the webhookResponseData array with the data received from the webhook endpoint
        response.webhookResponseData = [
          webhookResponse1.data,
          webhookResponse2.data,
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
