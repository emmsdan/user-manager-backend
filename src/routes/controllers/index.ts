import 'reflect-metadata';
import dotenv from 'dotenv';
import SetupController from './SetupController/SetupController';
import AuthenticationController from './AuthenticationController/AuthenticationController';
dotenv.config();

export { SetupController, AuthenticationController };
