import { OK, BAD_REQUEST } from 'http-status-codes';
import { getEnv, columnTransformer } from './helpers';

describe('HELPERS Tests', () => {
  it('should return process.env', (done) => {
    process.env = { DB_NAME: 'authenticator_manager' };
    const dbname = getEnv('DB_NAME');
    expect(dbname).toBe(process.env.DB_NAME);
    done();
  });

  it('should return lowercase value', (done) => {
    const lower = columnTransformer.from('UPPERCASE');
    expect(lower).toBe('UPPERCASE'.toLocaleLowerCase());
    done();
  });

  it('should return null value', (done) => {
    const nullValue = columnTransformer.from(null);
    const isNull = columnTransformer.to(null);
    expect(nullValue).toBeFalsy();
    expect(isNull).toBeNull();
    done();
  });
});
