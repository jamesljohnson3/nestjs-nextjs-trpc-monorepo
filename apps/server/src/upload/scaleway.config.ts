import { registerAs } from '@nestjs/config';

export default registerAs('scaleway', () => ({
  ACCESS_KEY_ID: process.env.SCW_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SCW_SECRET_ACCESS_KEY,
  REGION: process.env.SCW_REGION,
  ENDPOINT: process.env.SCW_ENDPOINT,
  BUCKET: process.env.SCW_BUCKET,
}));
