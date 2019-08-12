import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { User } from '../../../db/models/User';
import {
  schema,
  hash,
  signToken,
  verifyToken,
  getUserFromToken,
} from '../../../shared/helpers/helpers';
import {
  CreateMainAccount,
  ConfirmNewRegistration,
} from '../../../shared/interfaces/CreateMainAccountRequest';
import { insertDB, updateDB, getUser } from '../../../shared/utils';
import EmailHandler from '../../../shared/helpers/EmailHandler';
import ResponseHandler from '../../../shared/helpers/ResponseHandler';
import { PasswordManager } from '../../../db/models/PasswordManager';
import { getConnection } from 'typeorm';

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
      const requestToken = signToken({ email, type: 'signup-dev' }, '4 hours');
      const { raw } = await insertDB(User, [
        { firstName, lastName, email, role, requestToken },
      ]);
      const mailer = await new EmailHandler().newAdminTemplate(
        email,
        raw[0].id,
        `${firstName} ${lastName}`
      );
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

  @Post('activate')
  @Middleware(schema(ConfirmNewRegistration).validate)
  private async confirmRegistration(request: Request, response: Response) {
    const { company, password, token } = request.body;
    try {
      let user = await getUserFromToken(token);
      if (!user.isActive && token === user.requestToken) {
        await insertDB(PasswordManager, [
          { currentPassword: await hash(password), id: user.id },
        ]);
        const { raw } = await updateDB(
          User,
          { isActive: true, company, requestToken: '' },
          { id: user.id, email: user.email }
        );
        user = { ...user, ...raw[0] };
      } else {
        user = {};
      }
      return new ResponseHandler(response, !user.company ? 1403 : 1404, user);
    } catch ({ statusCode, message }) {
      return new ResponseHandler(response, statusCode || 1501, message);
    }
  }
}
