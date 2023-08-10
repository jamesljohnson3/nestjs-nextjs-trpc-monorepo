import { Controller, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Controller('user')
export class CheckUserController {
  private readonly webhookUrl =
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e';

  constructor(private readonly httpService: HttpService) {}

  @Post('check-existence')
  async checkUserExistence(@Body() data: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(this.webhookUrl, data)
        .toPromise();

      return response!.data; // Use a non-null assertion
    } catch (error) {
      throw new Error('Error communicating with webhook endpoint');
    }
  }
}
