import { createConnection, getConnection } from 'typeorm';
import { Logger } from '@overnightjs/logger';

createConnection()
  .then(async (connection) => {
    if (connection.isConnected) {
      Logger.Imp('All tables created');
    }
    connection.close();
  })
  .catch((error) => {
    Logger.Err(
      {
        message: 'we got some errors here',
        error,
      },
      true
    );
  });
