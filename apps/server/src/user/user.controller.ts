// user.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('check-existence')
  async checkUserExistence(@Body() requestBody: { email: string }) {
    return this.userService.checkUserExistence(requestBody.email);
  }
}
