import { readFileSync } from 'fs';
export default class ResponseHandler {
  /**
   * get access to the json file that contain
   * all the status message
   */
  public statusLibrary() {
    const filename = `${__dirname}/../../../status-code.json`;
    return JSON.parse(readFileSync(filename, 'utf8'));
  }

  constructor(res: any, status: number, payload: {}, message='') {
    const response = this.statusLibrary()[status];
    if (message) { response.message = message; }
    if (response.type !== 'error') {
      res.status(response.statusCode).json(this.success(response, payload));
      return;
    }
    res.status(response.statusCode).json(this.error(response, payload));
    return;
  }

  /**
   * error response
   * @param response express object
   * @param payload output data
   */
  public success(response: any, payload: {}) {
    return { ...response, data: { ...payload } };
  }

  /**
   * error response
   * @param response express object
   * @param error optional output payload data
   */
  public error(response: any, error: {}) {
    return { ...response, error };
  }
}
