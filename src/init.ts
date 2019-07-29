import InitServer from './server';
import * as path from 'path';
import { LoggerModes } from '@overnightjs/logger';
import { unlinkSync } from 'fs';

const server = new InitServer();

// Set the
const logFilePath = path.join(__dirname, '../logs/errors.log');

process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.File;
process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP = 'TRUE';
process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;

server.start(4321);

// Remove current log file if it exists
(function removeFile() {
  try {
    unlinkSync(logFilePath);
  } catch (e) {
    return;
  }
})();
