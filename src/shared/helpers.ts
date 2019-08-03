import { validate } from 'class-validator';

import ResponseHandler from './ResponseHandler';
import { Logger } from '@overnightjs/logger';
import { Response, Request } from 'express';
import { IDynamicObject } from './interfaces/interfaces';

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
        Logger.Warn(validationResponse);
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

/**
 * inputValidator()
 * @description used to validate incoming input requests
 * @param Schema validation class/schema
 * @param response express response object
 * @param request express request object
 */
export async function inputValidator(schema: any, response: any, request: any) {
  const serializeSchema = new schema();
  Object.keys(request.body).forEach((fields) => {
    serializeSchema[fields] = request.body[fields];
  });
  const validationResponse = await validate(serializeSchema, {
    validationError: { target: false },
  });
  if (validationResponse) {
    return new ResponseHandler(response, 1301, validationResponse);
  }
}

function formatValidationError(errors: any) {
  const format = errors.map((error: any) => {
    const list: IDynamicObject = {};
    list[error.property] = Object.values(error.constraints);
    return list;
  });
  return format;
}
