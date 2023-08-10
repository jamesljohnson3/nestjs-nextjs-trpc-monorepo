import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async checkUserExistence(email: string, currentUrl: string) {
    const webhookEndpoint =
      'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e';

    try {
      const response = await this.httpService
        .post(webhookEndpoint, { email, currentUrl })
        .toPromise();

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response from webhook API');
      }
    } catch (error) {
      throw new Error('Error communicating with webhook API');
    }
  }
}
