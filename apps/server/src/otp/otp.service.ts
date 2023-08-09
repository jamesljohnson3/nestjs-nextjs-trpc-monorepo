import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import * as speakeasy from 'speakeasy';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class OtpService {
  private otpSecrets: Map<string, string> = new Map(); // Store secrets by user email

  constructor(private readonly emailService: EmailService) {}

  generateAndSendOtp(email: string, currentUrl: string): string {
    const secret = speakeasy.generateSecret().base32;
    console.log('Generated secret:', secret);

    this.otpSecrets.set(email, secret);

    const otpCode = speakeasy.totp({
      secret,
      encoding: 'base32',
    });
    console.log('Generated OTP code:', otpCode);

    // Send OTP email
    this.emailService.sendOtpEmail(email, otpCode, currentUrl);

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

    const isValid = this.verifyOtpAsync(secret, verifyOtpDto.otp);

    if (isValid) {
      // Remove the secret after successful verification
      this.otpSecrets.delete(verifyOtpDto.email);

      // Send webhook request for email confirmation
      console.log('Sending confirmation email for email:', verifyOtpDto.email);
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

  private verifyOtpAsync(secret: string, otp: string): boolean {
    try {
      const isValid = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: otp,
      });

      console.log('OTP verification result:', isValid);

      return isValid;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  }
}
