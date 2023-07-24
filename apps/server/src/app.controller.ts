import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

interface ApiResponse {
  message: string;
  isValid: boolean;
  webhookResponseData?: any;
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
    const authorizedUUID = authorizationHeader?.split(' ')[1]; // Extract the UUID from the Authorization header

    // Check if the provided UUID matches the allowed UUID
    if (!authorizedUUID || !this.isValidUUID(authorizedUUID)) {
      return { message: 'Unauthorized', isValid: false };
    }

    // If the UUID is valid, respond with a JSON object containing the message and isValid value
    const response: ApiResponse = { message: 'Hello, World!', isValid: true };
    const webhookResponse: AxiosResponse<any> | undefined =
      await this.makeWebhookRequest(response);

    if (webhookResponse) {
      console.log('Webhook response:', webhookResponse.data);
      // Include the webhook response data in the response object
      response.webhookResponseData = webhookResponse.data;
    } else {
      console.error('Webhook request failed');
    }

    return response;
  }

  @Post() // Handles POST requests to /actions
  async postAction(
    @Headers('authorization') authorizationHeader: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const authorizedUUID = authorizationHeader?.split(' ')[1]; // Extract the UUID from the Authorization header

    // Check if the provided UUID matches the allowed UUID
    if (!authorizedUUID || !this.isValidUUID(authorizedUUID)) {
      return { message: 'Unauthorized', isValid: false };
    }

    // If the UUID is valid, respond with a JSON object containing the message and isValid value
    const response: ApiResponse = { message: 'Hello, World!', isValid: true };
    const webhookResponse: AxiosResponse<any> | undefined =
      await this.makeWebhookRequest(response);

    if (webhookResponse) {
      console.log('Webhook response:', webhookResponse.data);
      // Include the webhook response data in the response object
      response.webhookResponseData = webhookResponse.data;
    } else {
      console.error('Webhook request failed');
    }

    return response;
  }

  private async makeWebhookRequest(
    responseData: ApiResponse,
  ): Promise<AxiosResponse<any> | undefined> {
    try {
      return await this.httpService
        .post(this.webhookUrl, responseData)
        .toPromise();
    } catch (error) {
      console.error('Error sending webhook:', error.message);
      return undefined;
    }
  }
}
