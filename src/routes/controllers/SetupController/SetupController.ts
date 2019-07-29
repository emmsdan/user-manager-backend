import { Request, Response } from 'express';
import {
  Controller,
  Middleware,
  Get,
  Put,
  Post,
  Delete,
} from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

@Controller('api')
export default class SetupController {
  public static SUCCESS_MSG = 'server controller is runnint well';
  @Get('/')
  private getMessage(req: Request, res: Response) {
    res.status(200).json({
      message: SetupController.SUCCESS_MSG,
    });
  }
}
