// user.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('check-existence')
  async checkUserExistence(
    @Body() requestBody: { email: string; currentUrl: string }, // Provide both email and currentUrl
  ) {
    return this.userService.checkUserExistence(
      requestBody.email,
      requestBody.currentUrl, // Pass currentUrl as an argument
    );
  }
}
