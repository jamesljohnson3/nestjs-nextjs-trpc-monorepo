import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailService } from './email.service';

@Injectable()
export class OtpService {
  private otpSecrets: { [key: string]: string } = {}; // Store secrets by user email

  constructor(private readonly emailService: EmailService) {}

  generateOtp(
    generateOtpDto: GenerateOtpDto,
    email: string,
    currentUrl: string,
  ): string {
    const secret = speakeasy.generateSecret();
    this.otpSecrets[email] = secret.base32;

    const otpCode = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    // Send OTP email
    this.emailService.sendOtpEmail(generateOtpDto.email, otpCode, currentUrl);

    return otpCode;
  }
  verifyOtp(verifyOtpDto: VerifyOtpDto, email: string, currentUrl: string) {
    // Verify OTP logic
    const isValid = speakeasy.totp.verify({
      secret: this.otpSecrets[verifyOtpDto.email],
      encoding: 'base32',
      token: verifyOtpDto.otp, // Use 'verifyOtpDto.otp' instead of 'verifyOtpDto.otpCode'
    });

    if (isValid) {
      // Send webhook request for email confirmation
      this.emailService.sendOtpEmail(
        verifyOtpDto.email,
        'CONFIRMED',
        currentUrl,
      );

      return {
        message: 'OTP verification successful',
        isValid: true,
      };
    } else {
      return {
        message: 'Invalid OTP',
        isValid: false,
      };
    }
  }
}
