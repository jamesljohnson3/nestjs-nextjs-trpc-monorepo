import { Injectable } from '@nestjs/common';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailService } from './email.service';
import * as speakeasy from 'speakeasy';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private otpSecrets: Map<string, string> = new Map(); // Store secrets by user email

  constructor(private readonly emailService: EmailService) {}

  generateOtp(
    generateOtpDto: GenerateOtpDto,
    email: string,
    currentUrl: string,
  ): string {
    const secret = speakeasy.generateSecret({ length: 20 }); // Generate a new secret

    // Store the secret for the user's email
    this.otpSecrets.set(generateOtpDto.email, secret.base32);

    // Generate the TOTP
    const otpCode = speakeasy.totp({
      secret: secret.base32,
      digits: 6,
    });

    // Send OTP email
    this.emailService.sendOtpEmail(generateOtpDto.email, otpCode, currentUrl);

    return otpCode;
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
    currentUrl: string,
  ): Promise<{ message: string; isValid: boolean }> {
    const secret = this.otpSecrets.get(verifyOtpDto.email);

    if (!secret) {
      console.log('Secret not found for email:', verifyOtpDto.email);
      return {
        message: 'Invalid OTP',
        isValid: false,
      };
    }

    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: verifyOtpDto.otp,
    });

    if (isValid) {
      // Remove the secret after successful verification
      this.otpSecrets.delete(verifyOtpDto.email);

      // Send webhook request for email confirmation
      await this.emailService.sendOtpEmail(
        verifyOtpDto.email,
        'CONFIRMED',
        currentUrl,
      );

      return {
        message: 'OTP verification successful',
        isValid: true,
      };
    } else {
      console.log('OTP verification failed for email:', verifyOtpDto.email);
      return {
        message: 'Invalid OTP',
        isValid: false,
      };
    }
  }
}
