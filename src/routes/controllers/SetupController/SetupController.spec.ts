import { OK, BAD_REQUEST } from 'http-status-codes';
import { SuperTest, Test, agent } from 'supertest';
import { Logger } from '@overnightjs/logger';
import TestServer from '../../../server';
import SetupController from './SetupController';

describe('SetupController Tests', () => {
  let httpAgent: SuperTest<Test>;

  beforeAll(done => {
    const server = new TestServer();
    httpAgent = agent(server.getExpressInstance());
    done();
  });

  describe('API: "/api/:name"', () => {
    const { SUCCESS_MSG } = SetupController;

    it(`should  message "${SUCCESS_MSG}" and a status code of "${OK}"`, done => {
      httpAgent.get(`/api/`).end((err, res) => {
        if (err) {
          Logger.Err(err, true);
        }
        expect(res.status).toBe(OK);
        expect(res.body.message).toBe(SUCCESS_MSG);
        done();
      });
    });
  });
});
