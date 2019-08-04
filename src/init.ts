import InitServer from './server';
import * as path from 'path';
import { LoggerModes, Logger } from '@overnightjs/logger';
import { unlinkSync } from 'fs';

const server = new InitServer();

const logFilePath = `../logs/${new Date().getTime()}-api-error.log`;
process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.File;
process.env.OVERNIGHT_LOGGER_FILEPATH = path.join(__dirname, logFilePath);

server.start(Number(process.env.PORT) || 9876);
export default server;
