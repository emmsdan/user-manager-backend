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
    const resp = response.error(payload, {});
    expect(resp).toHaveProperty('username');
    expect(resp).toHaveProperty('error');
    expect(resp).toMatchObject(payload);
    done();
  });

  it('should return error response', (done) => {
    const resp = response.success(payload, {});
    expect(resp).toHaveProperty('username');
    expect(resp).toHaveProperty('data');
    expect(resp).toMatchObject(payload);
    done();
  });
});
