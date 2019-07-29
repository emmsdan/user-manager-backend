import * as bodyParser from 'body-parser';
import * as controllers from './routes/controllers';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Application } from 'express';
import { createConnection, getConnection } from 'typeorm';

class InitServer extends Server {
  private readonly SERVER_STARTED = 'Auth server started on port: ';
  public isStarted: boolean;

  constructor() {
    super(true);
    this.isStarted = false;
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.setupControllers();
  }

  private setupControllers(): void {
    const ctlrInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        const controller = (controllers as any)[name];
        ctlrInstances.push(new controller());
      }
    }
    super.addControllers(ctlrInstances);
  }

  public async start(port: number): Promise<any> {
    return createConnection().then(async () => {
      if (!this.isStarted) {
        const liveserver = await this.app.listen(port);
        this.isStarted = true;
      }
    });
  }

  public getExpressInstance(): Application {
    return this.app;
  }
}

export default InitServer;
