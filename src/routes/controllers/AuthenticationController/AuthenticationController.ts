import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { User } from '../../../db/models/User';
import { schema, getEnv } from '../../../shared/helpers/helpers';
import { CreateMainAccount } from '../../../shared/interfaces/CreateMainAccountRequest';
import { insertDB } from '../../../shared/utils';
import EmailHandler from '../../../shared/helpers/EmailHandler';
import ResponseHandler from '../../../shared/helpers/ResponseHandler';

@Controller('api/v1/account')
export default class AuthenticationController {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  @Post('register')
  @Middleware(schema(CreateMainAccount).validate)
  private async register(request: Request, response: Response) {
    try {
      const { firstName, lastName, email, role } = request.body;
      const { raw } = await insertDB(User, [
        { firstName, lastName, email, role },
      ]);
      const mailer = await new EmailHandler({
        from: 'no_reply',
        to: email,
        subject: 'welcome to auth.js',
        template: 'email',
        context: {
          heading: `Hi ${firstName} ${lastName}`,
          body: 'Please, follow this link to activate your account',
          useButton: true,
          buttonText: 'ACTIVATE ACCOUNT',
          buttonURL: `${getEnv('FRONTEND_URL')}/activate/${raw[0].id}`,
        },
      }).send();
      return new ResponseHandler(
        response,
        1402,
        raw[0],
        'Hi, follow the link sent to your email, to activate your account.'
      );
    } catch (error) {
      return new ResponseHandler(response, 1501, error.message);
    }
  }
}
