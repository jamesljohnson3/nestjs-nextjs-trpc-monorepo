import { Injectable } from '@nestjs/common';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailService } from './email.service';
import * as otpGenerator from 'otp-generator';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private otpSecretHashes: Map<string, string> = new Map(); // Store secret hashes by user email

  constructor(private readonly emailService: EmailService) {}

  generateOtp(
    generateOtpDto: GenerateOtpDto,
    email: string,
    currentUrl: string,
  ): string {
    const secret = crypto.randomBytes(16).toString('hex'); // Generate a new random secret

    // Hash the secret and store the hash for the user's email
    const secretHash = crypto.createHash('sha256').update(secret).digest('hex');
    this.otpSecretHashes.set(generateOtpDto.email, secretHash);

    // Generate the OTP using otp-generator
    const otpCode = otpGenerator.generate(6, {
      digits: true,
    });

    // Send OTP email
    this.emailService.sendOtpEmail(generateOtpDto.email, otpCode, currentUrl);

    return otpCode;
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
    currentUrl: string,
  ): Promise<{ message: string; isValid: boolean }> {
    const storedSecretHash = this.otpSecretHashes.get(verifyOtpDto.email);
    if (!storedSecretHash) {
      return {
        message: 'Invalid OTP',
        isValid: false,
      };
    }

    const providedSecretHash = crypto
      .createHash('sha256')
      .update(verifyOtpDto.otp)
      .digest('hex');

    if (storedSecretHash === providedSecretHash) {
      // Remove the secret hash after successful verification
      this.otpSecretHashes.delete(verifyOtpDto.email);

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
        isValid: true,
      };
    }
  }
}
