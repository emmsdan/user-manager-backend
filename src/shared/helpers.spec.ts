import { OK, BAD_REQUEST } from 'http-status-codes';
import { getEnv } from './helpers';

describe('HELPERS Tests', () => {
  it('should return process.env', done => {
    process.env = { DB_NAME: 'authenticator_manager' };
    const dbname = getEnv('DB_NAME');
    expect(dbname).toBe(process.env.DB_NAME);
    done();
  });
});
