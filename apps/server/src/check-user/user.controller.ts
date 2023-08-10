import { Controller, Post, Body } from '@nestjs/common';
import fetch from 'node-fetch';

@Controller('check-user')
export class DataController {
  @Post('check-user')
  async sendDataToWebhook(@Body() data: { email: string }) {
    try {
      const webhookUrl =
        'Yhttps://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const webhookResponse = await response.json();
      return webhookResponse;
    } catch (error) {
      return { error: 'An error occurred while sending data to webhook.' };
    }
  }
}
