import {
  OK,
  BAD_REQUEST,
  CREATED,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from 'http-status-codes';
import { SuperTest, Test, agent } from 'supertest';
import { createConnection, Connection } from 'typeorm';
import faker from 'faker';

import TestServer from '../../../init';
import AuthenticationController from './AuthenticationController';
import { getEnv, signToken } from '../../../shared/helpers/helpers';
import { Logger } from '@overnightjs/logger';

let httpAgent: SuperTest<Test>;
let mockConnection: Connection;
const server = TestServer;

describe('AuthenticationController Tests', () => {
  const API_URL = '/api/v1/account/';
  const user = {
    firstName: faker.name.firstName(1),
    lastName: faker.name.lastName(1),
    email: faker.internet.email().toLocaleLowerCase(),
    role: 'UNKNOWN_ROLE',
  };

  const userInfo = {
    company: faker.random.words(3),
    password: faker.internet.password(6),
  };

  let requestToken = signToken({ email: user.email, type: 'signup-dev' });
  beforeAll(async (done) => {
    httpAgent = await agent(server.getExpressInstance());
    mockConnection = await createConnection();
    done();
  });

  test(`should return validation error`, async (done) => {
    const response = await httpAgent.post(`${API_URL}register`).send(user);
    expect(response.status).toBe(UNPROCESSABLE_ENTITY);
    expect(response.body.error).toMatchObject([
      { role: ['role must be a valid enum value'] },
    ]);
    expect(response.body.message).toBe('Invalid credentials.');
    done();
  });

  test(`should register a new user`, async (done) => {
    user.role = 'DEVELOPER';
    const response = await httpAgent.post(`${API_URL}register`).send(user);
    expect(response.status).toBe(CREATED);
    expect(response.body.data).toMatchObject(user);
    expect(response.body.message).toBe(
      'Hi, follow the link sent to your email, to activate your account.'
    );
    requestToken = response.body.data.requestToken;
    done();
  });

  test(`should register a new user but not send email`, async (done) => {
    user.role = 'DEVELOPER';
    user.email = faker.internet.email().toLocaleLowerCase();
    process.env.SMTP_HOST = 'none';
    const response = await httpAgent.post(`${API_URL}register`).send(user);
    expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    expect(response.body.error).toBe('Server Error: Email could not be sent.');
    done();
  });
  test(`should confirm/activate new dev account`, async (done) => {
    const response = await httpAgent
      .post(`${API_URL}complete-signup`)
      .set('accessToken', requestToken)
      .send(userInfo);
    delete userInfo.password;
    expect(response.status).toBe(OK);
    expect(response.body.data).toMatchObject(userInfo);
    expect(response.body.data.lastName).toBe(user.lastName);
    expect(response.body.data.isActive).toBe(true);
    done();
  });

  test(`should already be activated.`, async (done) => {
    delete user.email;
    userInfo.password = '0989gyifugv';
    const response = await httpAgent
      .post(`${API_URL}complete-signup`)
      .set('accessToken', requestToken)
      .send(userInfo);
    expect(response.status).toBe(OK);
    expect(response.body.data).toEqual({});
    expect(response.body.message).toBe(
      'Please, Login this account has been activated.'
    );
    done();
  });

  test(`access token should be invalid`, async (done) => {
    const response = await httpAgent
      .post(`${API_URL}complete-signup`)
      .set('accessToken', 'signToken({ email: faker.internet.email() })')
      .send(userInfo);
    expect(response.status).toBe(UNAUTHORIZED);
    expect(response.body.message).toBe('Invalid token/url, provided.');
    done();
  });

  test(`accessToken NOT EQUAL TO requestToken`, async (done) => {
    const response = await httpAgent
      .post(`${API_URL}complete-signup`)
      .set('accessToken', signToken({ email: faker.internet.email() }))
      .send(userInfo);
    expect(response.status).toBe(UNAUTHORIZED);
    expect(response.body.message).toBe('Invalid token/url, provided.');
    done();
  });
});