import { validate } from 'class-validator';

import ResponseHandler from './ResponseHandler';
import { Response, Request } from 'express';
import { IDynamicObject } from '../interfaces/interfaces';

/**
 * getEnv
 * @param variable the ENV you want to get
 */
export function getEnv(variable: string) {
  return process.env[variable];
}

/**
 * inputValidator()
 * @description used to validate incoming input requests
 * @param Schema validation class/schema
 */
export function schema(schemaData: any) {
  return {
    validate: async (request: Request, response: Response, next: any) => {
      const serializeSchema = new schemaData();
      await Object.keys(request.body).forEach((fields) => {
        serializeSchema[fields] = request.body[fields];
      });
      return validate(serializeSchema, {
        validationError: { target: false },
      }).then((validationResponse) => {
        if (validationResponse && validationResponse.length > 0) {
          return new ResponseHandler(
            response,
            1301,
            formatValidationError(validationResponse)
          );
        } else {
          return next();
        }
      });
    },
  };
}

function formatValidationError(errors: any) {
  const format = errors.map((error: any) => {
    const list: IDynamicObject = {};
    list[error.property] = Object.values(error.constraints);
    return list;
  });
  return format;
}

export const columnTransformer = {
  from: (value?: string | null) =>
    value === undefined || value === null ? value : value.toLocaleLowerCase(),
  to: (value?: string | null) =>
    value === undefined || value === null ? value : value.toLocaleLowerCase(),
};
