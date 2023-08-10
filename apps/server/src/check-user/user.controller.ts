import { Controller, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Controller('user')
export class CheckUserController {
  private readonly webhookUrl =
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e';

  constructor(private readonly httpService: HttpService) {}

  @Post('check-existence')
  async checkUserExistence(
    @Body() requestBody: { email: string },
  ): Promise<any> {
    try {
      console.log('Checking user existence for email:', requestBody.email);

      // Create the payload to send to the webhook API
      const payload = {
        email: requestBody.email,
        // Add other fields as needed
      };

      console.log('Sending payload to webhook API:', payload);

      // Send the POST request to the webhook API
      const response = await this.httpService
        .post(this.webhookUrl, payload)
        .toPromise();

      console.log('Webhook API response:', response?.data);

      // Return the data from the webhook API response
      return response?.data;
    } catch (error) {
      console.error('Error communicating with webhook API:', error.message);
      throw new Error('Error communicating with webhook API');
    }
  }
}
