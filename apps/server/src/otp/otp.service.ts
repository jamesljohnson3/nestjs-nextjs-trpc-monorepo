// src/otp/otp.service.ts

import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class OtpService {
  generateOtp(email: string): string {
    const secret = speakeasy.generateSecret();
    // Save the generated secret and associate it with the user's email

    const otpCode = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    // Send the OTP code to the user's email
    // You can use a separate email service or library to send the email

    return otpCode;
  }
}
