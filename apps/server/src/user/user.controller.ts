import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('check-existence')
  async checkUserExistence(
    @Body() requestBody: { email: string; currentUrl: string },
  ) {
    try {
      console.log('Checking user existence for email:', requestBody.email);

      const rawData = await this.userService.checkUserExistence(
        requestBody.email,
        requestBody.currentUrl,
      );

      // Pass the raw data back to the client (Next.js app)
      return rawData;
    } catch (error) {
      // Handle any errors that occurred during the process
      return { error: 'An error occurred while checking user existence.' };
    }
  }
}
