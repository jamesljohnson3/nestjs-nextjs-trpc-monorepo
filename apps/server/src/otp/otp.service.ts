import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { GenerateOtpDto } from './dto/generate-otp.dto'; // Keep this import statement
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailService } from './email.service';
import { WebhookService } from './webhook.service';

@Injectable()
export class OtpService {
  private otpSecrets: { [key: string]: string } = {}; // Store secrets by user email

  constructor(
    private readonly emailService: EmailService,
    private readonly webhookService: WebhookService,
  ) {}

  generateOtp(generateOtpDto: GenerateOtpDto): string {
    const secret = speakeasy.generateSecret();
    this.otpSecrets[generateOtpDto.email] = secret.base32;

    const otpCode = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    // Send OTP email
    this.emailService.sendOtpEmail(generateOtpDto.email, otpCode);

    return otpCode;
  }

  verifyOtp(verifyOtpDto: VerifyOtpDto) {
    // Verify OTP logic and send webhook requests
    const isValid = speakeasy.totp.verify({
      secret: this.otpSecrets[verifyOtpDto.email],
      encoding: 'base32',
      token: verifyOtpDto.otp, // Change this to 'otp' instead of 'otpCode'
    });

    if (isValid) {
      // Send webhook requests
      const webhookResponseData = this.webhookService.sendWebhookRequest(
        verifyOtpDto.email,
      );

      return {
        message: 'OTP verification successful',
        isValid: true,
        webhookResponseData,
      };
    } else {
      return {
        message: 'Invalid OTP',
        isValid: false,
      };
    }
  }
}
