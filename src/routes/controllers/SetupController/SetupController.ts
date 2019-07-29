import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { User } from '../../../db/models/User';
import { getRepository, createConnection, getConnection } from 'typeorm';
import { OK } from 'http-status-codes';
import ResponseHandler from '../../../shared/ResponseHandler';

@Controller('api')
export default class SetupController {
  public static SUCCESS_MSG = 'server controller is runnint well';
  private readonly logger: Logger;
  // private connection;
  constructor() {
    // this.connection = await createConnection();
    this.logger = new Logger();
  }

  @Get('/')
  private async getMessage(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const user = await userRepository.find();
    await userRepository.save(user);
    // tslint:disable-next-line: no-unused-expression
    new ResponseHandler(res, 1401, SetupController.SUCCESS_MSG);
  }
}
