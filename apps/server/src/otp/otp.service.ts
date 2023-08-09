import { Injectable } from '@nestjs/common';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailService } from './email.service';
import * as otpGenerator from 'otp-generator';
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
    const secret = crypto.randomBytes(16).toString('hex'); // Generate a new random secret

    // Store the secret for the user's email
    this.otpSecrets.set(generateOtpDto.email, secret);

    // Generate the OTP using otp-generator
    const otpCode = otpGenerator.generate(6, {
      digits: true,
    });

    // Send OTP email
    this.emailService.sendOtpEmail(generateOtpDto.email, otpCode, currentUrl);

    return otpCode;
  }

  verifyOtp(verifyOtpDto: VerifyOtpDto, currentUrl: string) {
    // Verify OTP logic
    const secret = this.otpSecrets.get(verifyOtpDto.email);
    console.log('Received OTP:', verifyOtpDto.otp);
    console.log('Stored Secret:', secret);

    const isValid = secret && verifyOtpDto.otp === secret; // Directly compare OTPs

    if (isValid) {
      console.log('OTP verification successful for email:', verifyOtpDto.email);

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
      console.log('OTP verification failed for email:', verifyOtpDto.email);
      return {
        message: 'Invalid OTP',
        isValid: false,
      };
    }
  }
}
