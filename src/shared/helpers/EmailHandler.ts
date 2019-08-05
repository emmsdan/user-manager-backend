import nodemailer from 'nodemailer';
import nunjucks from 'nunjucks';

import { getEnv } from './helpers';
import { Logger } from '@overnightjs/logger';

nunjucks.configure('./src/public/', { autoescape: true });

interface IOptions {
  template?: string;
  context?: object;
  subject: string;
  from: string;
  to: string;
  body?: string;
  [key: string]: any;
}

export default class EmailHandler {
  private emailOption: {};
  private mailReciever: string;
  private mailText: string;
  private mailHtml: string;
  private mailSubject: string;
  private mailSender: string;
  constructor(public options?: IOptions) {
    let option: { [key: string]: any };
    if (options) {
      option = {
        ...options,
        text: options.body,
        html: nunjucks.render(`${options.template}.html`, options.context),
      };
      delete option.body;
      this.emailOption = option;
    }
  }

  /**
   * send the email
   * @returns as a promise
   */
  public async send() {
    try {
      return await this.getMailer().sendMail({ ...this.emailOption });
    } catch (error) {
      Logger.Imp(error, true);
      throw new Error('Server Error: Email could not be sent.');
    }
  }
  private getMailer() {
    return nodemailer.createTransport({
      host: getEnv('SMTP_HOST'),
      port: Number(getEnv('SMTP_PORT')),
      secure: false,
      auth: {
        user: getEnv('SMTP_USERNAME'),
        pass: getEnv('SMTP_PASSWORD'),
      },
    });
  }
  /**
   * newAdminTemplate
   * @param to reciever
   * @param userId activation url
   * @param name users name
   */
  public newAdminTemplate(to: string, userId: string, name: string) {
    const context = {
      heading: `Hi ${name}`,
      body: 'Please, follow this link to activate your account',
      useButton: true,
      buttonText: 'ACTIVATE ACCOUNT',
      buttonURL: `${getEnv('FRONTEND_URL')}/activate/${userId}`,
    };
    const body = nunjucks.render('email.html', context);
    this.emailOption = {
      text: body,
      html: body,
      subject: 'Welcome to User Manager',
      to,
      from: 'no_reply@usermanager.io',
    };
    return this.send();
  }
}
