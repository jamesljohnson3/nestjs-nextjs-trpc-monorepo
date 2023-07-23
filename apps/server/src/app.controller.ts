import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { XataClient, Items } from './xata'; // Replace with the actual path to your XataClient file

@Controller('actions')
export class AppController {
  private readonly xataClient: XataClient;

  constructor() {
    this.xataClient = new XataClient();
  }

  @Post('get-allowed-uuid')
  async getAllowedUUID(@Body() requestBody: any) {
    const { db_branch_name, table_name, filter } = requestBody;

    // Make sure you have the necessary properties in the requestBody
    if (!db_branch_name || !table_name || !filter) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }

    try {
      // Assuming you want to filter the items table using the provided filter
      const items: Items[] | null = await this.xataClient.getAll<Items>(table_name, filter);

      // Check if 'items' is null or undefined before proceeding
      if (!items) {
        throw new HttpException('No items found', HttpStatus.NOT_FOUND);
      }

      // Assuming you have a column named 'api_key' in the items table to store the allowed UUID
      const allowedUUIDs: string[] = items.map((item) => item.api_key);

      // If the 'allowedUUIDs' array is empty, throw an error
      if (allowedUUIDs.length === 0) {
        throw new HttpException('Allowed UUID not found', HttpStatus.NOT_FOUND);
      }

      // Respond with the array of allowed UUIDs
      return { allowedUUIDs };
    } catch (error) {
      // Handle errors from Xata API (e.g., network issues, invalid response, etc.)
      throw new HttpException('Error fetching allowed UUIDs from Xata', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
