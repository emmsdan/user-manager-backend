import { OK, BAD_REQUEST } from 'http-status-codes';
import { SuperTest, Test, agent } from 'supertest';
import { Logger } from '@overnightjs/logger';
import TestServer from '../../../init';
import SetupController from './SetupController';
import { createConnection, Connection } from 'typeorm';
import { getEnv } from '../../../shared/helpers';

describe('SetupController Tests', () => {
  let httpAgent: SuperTest<Test>;
  let mockConnection: Connection;
  const server = TestServer;

  beforeAll(async (done) => {
    httpAgent = await agent(server.getExpressInstance());
    mockConnection = await createConnection();
    done();
  });
  const { SUCCESS_MSG } = SetupController;

  test(`should startup api server`, async (done) => {
    const response = await httpAgent.get(`/api/?sadad`);
    expect(response.status).toBe(OK);
    expect(response.body.message).toBe(SUCCESS_MSG);
    done();
  });
  test('should start server on a different port', async (done) => {
    await mockConnection.close();
    await server.start(1929);
    expect(server.isStarted).toBeTruthy();
    done();
  });
});
