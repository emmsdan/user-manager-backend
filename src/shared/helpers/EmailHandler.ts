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
  private emailBody = `Hello! Here's the link you requested from usermanager.io \n\n <br/> \n
  For extra security, the link can only be used one time and expires in two hours time.`;

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
        html: options.template
          ? nunjucks.render(`${options.template}.html`, options.context)
          : options.html,
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

  /**
   * buttonTemplate
   */
  public async buttonTemplate(options: any) {
    try {
      const { name, email, buttonText, buttonURL, body, subject } = options;
      const ebody = body === 'forgot_password' ? this.emailBody : body;
      const context = {
        heading: `Hi, ${name}`,
        body: ebody,
        useButton: true,
        buttonURL,
        buttonText,
      };
      this.emailOption = {
        to: email,
        from: 'no_reply@usermanager.io',
        subject,
        text: ebody,
        html: nunjucks.render('email.html', context),
      };
      return await this.send();
    } catch ({ message }) {
      return message;
    }
  }
}
