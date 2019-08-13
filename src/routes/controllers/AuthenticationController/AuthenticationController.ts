import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { User } from '../../../db/models/User';
import { schema, signToken } from '../../../shared/helpers/helpers';
import {
  CreateMainAccount,
  CompleteNewRegistration,
  LoginRequest,
} from '../../../shared/interfaces/CreateMainAccountRequest';
import {
  insertDB,
  activateUser,
  getUser,
  updateDB,
} from '../../../shared/utils';
import EmailHandler from '../../../shared/helpers/EmailHandler';
import ResponseHandler from '../../../shared/helpers/ResponseHandler';
import { validateUserToken } from '../../../middlewares/user';

@Controller('api/v1/account')
export default class AuthenticationController {
  private readonly logger: Logger;
  private readonly emailMessage = `Please check your inbox and click the link.`;
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
        raw[0].requestToken,
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

  @Post('complete-signup')
  @Middleware([schema(CompleteNewRegistration).validate, validateUserToken])
  private async completeRegistration(request: Request, response: Response) {
    const { validatedUser, user } = request.body;
    const { isActive, requestToken, accessToken } = validatedUser;
    if (isActive) {
      return new ResponseHandler(response, 1403, {});
    }
    if (accessToken !== requestToken) {
      return new ResponseHandler(response, 1208, {});
    }
    const [, updatedUser] = await activateUser(validatedUser);
    return new ResponseHandler(response, 1404, {
      ...user,
      ...updatedUser.raw[0],
    });
  }

  @Post('login-link')
  @Middleware(schema(LoginRequest).validate)
  private async oneTimeAccess(request: Request, response: Response) {
    const { email: userEmail } = request.body;
    const { email, isActive, firstName, id } = await getUser(userEmail);
    if (!isActive) {
      return new ResponseHandler(response, 1205, '');
    }
    const requestToken = signToken({ email, firstName, id }, '2 hours');
    const mailer = await Promise.all([
      updateDB(User, { requestToken }, { id, email }),
      new EmailHandler().buttonTemplate({
        email,
        name: firstName,
        subject: 'Login to usermanager.io',
        body: 'forgot_password',
        buttonURL: `auto-login/${requestToken}`,
        buttonText: 'Login to Usermanager.io',
      }),
    ]);
    return new ResponseHandler(response, 1403, '', this.emailMessage);
  }
}
