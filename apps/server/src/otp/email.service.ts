import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  sendOtpEmail(email: string, otpCode: string): void {
    // Implement your email sending logic here
    console.log(`Sending OTP email to ${email} with OTP code ${otpCode}`);
  }
}
