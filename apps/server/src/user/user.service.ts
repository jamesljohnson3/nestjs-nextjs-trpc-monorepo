import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async checkUserExistence(email: string, currentUrl: string): Promise<any> {
    try {
      console.log('Checking user existence...');

      // Configure your webhook API endpoint
      const webhookEndpoint =
        'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e';

      // Create the payload to send to the webhook API
      const payload = {
        email,
        currentUrl,
      };

      // Send the POST request to the webhook API
      const response = await this.httpService
        .post(webhookEndpoint, payload)
        .toPromise();

      // Return the raw data from the API response
      return response?.data;
    } catch (error) {
      console.error('Error communicating with webhook API:', error.message);
      throw new Error('Error communicating with webhook API');
    }
  }
}
