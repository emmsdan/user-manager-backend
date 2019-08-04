import { OK, BAD_REQUEST } from 'http-status-codes';
import ResponseHandler from './ResponseHandler';

describe('RESPONSE HANDLER Tests', () => {
  const payload = {
    username: 'emmsdan',
    email: 'fakemail@gmail.com',
    type: 'success',
  };
  const res = {
    status: jest.fn(() => {
      return {
        json: jest.fn(),
      };
    }),
  };
  const response = new ResponseHandler(res, 1000, {
    ...payload,
    type: 'error',
  });

  it('should return error response', (done) => {
    const error = response.error(payload, {});
    expect(error).toHaveProperty('error');
    expect(error).toMatchObject(payload);
    done();
  });

  it('should return error response', (done) => {
    const success = response.success(payload, { res });
    expect(success).toHaveProperty('username');
    expect(success).toHaveProperty('data');
    expect(success).toMatchObject(payload);
    done();
  });
});
