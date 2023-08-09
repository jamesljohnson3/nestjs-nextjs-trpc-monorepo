import { Injectable, HttpServer } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class WebhookService {
  private webhookUrls: string[] = [
    'https://webhook-url1',
    'https://webhook-url2',
    'https://webhook-url3',
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
