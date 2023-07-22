import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('actions')
export class AppController {
  private readonly allowedUUID = 'your-allowed-uuid'; // Replace with your authorized UUID

  @Get() // Handles GET requests to /actions
  getAction(@Headers('authorization') authorizationHeader: string) {
    const authorizedUUID = authorizationHeader?.split(' ')[1]; // Extract the UUID from the Authorization header

    // Check if the provided UUID matches the allowed UUID
    if (!authorizedUUID || authorizedUUID !== this.allowedUUID) {
      throw new UnauthorizedException('Unauthorized');
    }

    // If the UUID is valid, respond with "Hello, World!"
    return { message: 'Hello, World!' };
  }

  @Post() // Handles POST requests to /actions
  postAction(
    @Headers('authorization') authorizationHeader: string,
    @Body() body: any,
  ) {
    const authorizedUUID = authorizationHeader?.split(' ')[1]; // Extract the UUID from the Authorization header

    // Check if the provided UUID matches the allowed UUID
    if (!authorizedUUID || authorizedUUID !== this.allowedUUID) {
      throw new UnauthorizedException('Unauthorized');
    }

    // If the UUID is valid, respond with "Hello, World!"
    return { message: 'Hello, World!' };
  }
}
