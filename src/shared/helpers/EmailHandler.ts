import nodemailer from 'nodemailer';
import nunjucks from 'nunjucks';

import { getEnv } from './helpers';

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
  constructor(public options: IOptions) {
    const option = {
      ...options,
      text: options.body,
      html: nunjucks.render(`${options.template}.html`, options.context),
    };
    delete option.body;
    this.emailOption = option;
  }

  /**
   * send the email
   * @returns as a promise
   */
  public async send() {
    try {
      return await this.getMailer().sendMail({ ...this.emailOption });
    } catch {
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
}
