import { Injectable, HttpServer } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class WebhookService {
  private webhookUrls: string[] = [
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e',
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/acgonuudtu441k97whj3xp8ykm9pme2s',
    'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/30sskndje19f0ws6ablrfbfujra8qr89',
  ]; // Replace with your actual webhook URLs

  constructor(private httpService: HttpServer) {}

  async sendWebhookRequest(
    data: any,
  ): Promise<Promise<AxiosResponse<any, any>>[]> {
    return this.webhookUrls.map((webhookUrl) => {
      return this.httpService
        .post(webhookUrl, data)
        .pipe(map((response) => response as AxiosResponse<any, any>))
        .toPromise();
    });
  }
}
