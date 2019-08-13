import InitServer from './server';
import * as path from 'path';
import { LoggerModes, Logger } from '@overnightjs/logger';
import { unlinkSync } from 'fs';
import { getEnv } from './shared/helpers/helpers';

if (getEnv('NODE_ENV') === 'test') {
  process.env.TYPEORM_LOGGING = 'false';
}
const server = new InitServer();

const logFilePath = `../logs/${new Date().getTime()}-api-error.log`;
process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.File;
process.env.OVERNIGHT_LOGGER_FILEPATH = path.join(__dirname, logFilePath);

server.start(getEnv('PORT') * 1 || 8765);
export default server;
