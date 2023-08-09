import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EmailService {
  constructor(private httpService: HttpService) {}

  async sendOtpEmail(
    email: string,
    otpCode: string,
    currentUrl: string,
  ): Promise<void> {
    // Implement your email sending logic here
    console.log(`Sending OTP email to ${email} with OTP code ${otpCode}`);

    // Send webhook request for email delivery
    const webhookUrl =
      'https://snap-jj3media-icloud-com.eu-1.celonis.cloud/ems-automation/public/api/root/a0e537b1-b88f-434c-a659-0cadea64b085/hook/f03auw3rub1gl5djqehmslc4rpm8j33e'; // Replace with your actual webhook URL
    const payload = {
      email,
      otpCode,
      currentUrl, // Include the currentUrl in the payload
    };

    try {
      const response = await this.httpService
        .post(webhookUrl, payload)
        .toPromise();

      if (response && response.data) {
        console.log('Webhook response:', response.data);
      } else {
        console.log('Webhook response is empty or undefined.');
      }
    } catch (error) {
      console.error('Error sending webhook request:', error);
    }
  }
}
