import { Controller, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Controller('store')
export class CheckUserController {
  private readonly webhookUrl =
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e';

  constructor(private readonly httpService: HttpService) {}

  @Post('check-user')
  async checkUserExistence(@Body() data: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(this.webhookUrl, data)
        .toPromise();

      return response?.data; // Use a non-null assertion
    } catch (error) {
      throw new Error('Error communicating with webhook endpoint');
    }
  }

  @Post('events') // Change 'events' to your desired endpoint
  async storeEvent(@Body() eventData: any): Promise<any> {
    try {
      // Modify the URL as needed for storing events
      const storeEventUrl =
        'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/8242ceb6-98ea-429b-b479-58f947b84822/hook/knjio0qaii63ef0s5qhjxf3w87dg84je';
      console.log('Event data to be stored:', eventData); // Console log statement

      const response = await this.httpService
        .post(storeEventUrl, eventData)
        .toPromise();

      return response?.data; // Use a non-null assertion
    } catch (error) {
      throw new Error('Error storing event');
    }
  }
}
