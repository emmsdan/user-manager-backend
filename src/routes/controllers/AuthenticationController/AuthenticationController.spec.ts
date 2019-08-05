import {
  OK,
  BAD_REQUEST,
  CREATED,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
} from 'http-status-codes';
import { SuperTest, Test, agent } from 'supertest';
import { Logger } from '@overnightjs/logger';
import { createConnection, Connection } from 'typeorm';
import faker from 'faker';

import TestServer from '../../../init';
import AuthenticationController from './AuthenticationController';
import { getEnv } from '../../../shared/helpers/helpers';

let httpAgent: SuperTest<Test>;
let mockConnection: Connection;
const server = TestServer;

describe('AuthenticationController Tests', () => {
  const API_URL = '/api/v1/account/register';
  const user = {
    firstName: faker.name.firstName(1),
    lastName: faker.name.lastName(1),
    email: faker.internet.email().toLocaleLowerCase(),
    role: 'UNKNOWN_ROLE',
  };

  beforeAll(async (done) => {
    httpAgent = await agent(server.getExpressInstance());
    mockConnection = await createConnection();
    done();
  });

  test(`should return validation error`, async (done) => {
    const response = await httpAgent.post(API_URL).send(user);
    expect(response.status).toBe(UNPROCESSABLE_ENTITY);
    expect(response.body.error).toMatchObject([
      { role: ['role must be a valid enum value'] },
    ]);
    expect(response.body.message).toBe('Invalid credentials.');
    done();
  });

  test(`should register a new user`, async (done) => {
    user.role = 'DEVELOPER';
    const response = await httpAgent.post(API_URL).send(user);
    expect(response.status).toBe(CREATED);
    expect(response.body.data).toMatchObject(user);
    expect(response.body.message).toBe(
      'Hi, follow the link sent to your email, to activate your account.'
    );
    done();
  });

  test(`should registe a new user but not send email`, async (done) => {
    user.role = 'DEVELOPER';
    user.email = faker.internet.email().toLocaleLowerCase();
    process.env.SMTP_HOST = 'none';
    const response = await httpAgent.post(API_URL).send(user);
    expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    expect(response.body.error).toBe('Server Error: Email could not be sent.');
    done();
  });
});
