import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { User } from '../../../db/models/User';
import { getRepository, createConnection, getConnection } from 'typeorm';
import { OK } from 'http-status-codes';
import ResponseHandler from '../../../shared/ResponseHandler';
import { schema } from '../../../shared/helpers';
import { CreateMainAccount } from '../../../shared/interfaces/CreateMainAccountRequest';
import { insertDB } from '../../../shared/utils';

@Controller('api/v1/auth')
export default class AuthenticationController {
  public SUCCESS_MSG = 'server controller is runnint well';
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  @Post('dev/register')
  @Middleware(schema(CreateMainAccount).validate)
  private async register(request: Request, response: Response) {
    try {
      const { firstName, lastName, email, role } = request.body;
      const newUser = await insertDB(User, [
        {
          firstName,
          lastName,
          email: email.toLocaleLowerCase(),
          role,
        },
      ]);
      console.log(newUser.roas);
      return new ResponseHandler(response, 1401, newUser);
    } catch (error) {
      return new ResponseHandler(response, 1501, error.message);
    }
  }
}
