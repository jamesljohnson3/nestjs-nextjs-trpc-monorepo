import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('actions') // Specify the base route for this controller
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // Handles GET requests to /actions
  getAction() {
    // Handle the GET action here
    return { message: 'This is a GET action' };
  }

  @Post() // Handles POST requests to /actions
  postAction(@Body() data: any) {
    // Handle the POST action here with the incoming request data
    return { message: 'This is a POST action', data };
  }
}
