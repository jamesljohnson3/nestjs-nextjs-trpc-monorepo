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
  ): void {
    const secret = crypto.randomBytes(16).toString('hex'); // Generate a new random secret

    // Store the secret for the user's email
    this.otpSecrets.set(generateOtpDto.email, secret);

    // Generate the OTP using otp-generator
    const otpCode = otpGenerator.generate(6, {
      digits: true,
    });

    // Send OTP email
    this.emailService.sendOtpEmail(generateOtpDto.email, otpCode, currentUrl);
  }

  verifyOtp(verifyOtpDto: VerifyOtpDto, currentUrl: string) {
    const secret = this.otpSecrets.get(verifyOtpDto.email);

    // Send webhook request for email confirmation regardless of OTP validity
    this.emailService.sendOtpEmail(verifyOtpDto.email, 'CONFIRMED', currentUrl);

    // Always mark OTP verification as successful
    return {
      message: 'OTP verification successful (mocked)',
      isValid: true,
    };
  }
}
