import { Controller, Get, Post, Body, Headers } from '@nestjs/common';

@Controller('actions')
export class AppController {
  private readonly allowedUUID = '22-22-22'; // Replace with your authorized UUID

  private isValidUUID(uuid: string): boolean {
    // Validate the provided UUID here (e.g., using a library like "uuid")
    // Return true if the UUID is valid, otherwise return false
    // Replace the example validation logic below with your actual validation logic
    return uuid === this.allowedUUID;
  }

  @Get() // Handles GET requests to /actions
  getAction(@Headers('authorization') authorizationHeader: string) {
    const authorizedUUID = authorizationHeader?.split(' ')[1]; // Extract the UUID from the Authorization header

    // Check if the provided UUID matches the allowed UUID
    if (!authorizedUUID || !this.isValidUUID(authorizedUUID)) {
      return { message: 'Unauthorized', isValid: false };
    }

    // If the UUID is valid, respond with a JSON object containing the message and isValid value
    return { message: 'Hello, World!', isValid: true };
  }

  @Post() // Handles POST requests to /actions
  postAction(
    @Headers('authorization') authorizationHeader: string,
    @Body() body: any,
  ) {
    const authorizedUUID = authorizationHeader?.split(' ')[1]; // Extract the UUID from the Authorization header

    // Check if the provided UUID matches the allowed UUID
    if (!authorizedUUID || !this.isValidUUID(authorizedUUID)) {
      return { message: 'Unauthorized', isValid: false };
    }

    // If the UUID is valid, respond with a JSON object containing the message and isValid value
    return { message: 'Hello, World!', isValid: true };
  }
}
