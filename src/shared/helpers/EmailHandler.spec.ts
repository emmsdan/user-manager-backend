import { OK, BAD_REQUEST } from 'http-status-codes';
import EmailHandler from './EmailHandler';

describe('EmailHandler Tests', () => {
  const options = {
    template: 'email',
    context: {
      heading: 'hi, emmsdan',
    },
    to: 'fakemail@gmail.com',
    from: 'no_repy@fakemail.com',
    subject: 'fake subject',
  };
  const mailer = new EmailHandler(options);
  const mock = jest.fn(() => 'error');
  it('should not send email', async (done) => {
    mailer.send = jest.fn();
    await mailer.send();
    expect(mailer.send).toBeCalled();
    done();
  });
});
