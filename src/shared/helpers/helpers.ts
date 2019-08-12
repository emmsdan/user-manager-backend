import { validate } from 'class-validator';

import ResponseHandler from './ResponseHandler';
import { Response, Request } from 'express';
import { IDynamicObject } from '../interfaces/interfaces';
import { getRepository } from 'typeorm';
import { User } from '../../db/models/User';
import bcrypt from 'bcrypt';
import jwt, { verify } from 'jsonwebtoken';
import { getUser } from '../utils';
/**
 * getEnv
 * @param variable the ENV you want to get
 */
export function getEnv(variable: string, optional: any = '') {
  return process.env[variable] || optional;
}

/**
 * hash/encrypt
 * @param params item to be encypted
 */
export async function hash(params: any) {
  return await bcrypt.hash(params, 1 * getEnv('SALT_ROUND', 8));
}

export function signToken(payload: any, expiresIn = '2 days') {
  return jwt.sign(payload, getEnv('ENCRYPTION_SECRET'), {
    expiresIn,
    subject: 'generic-token',
  });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, getEnv('ENCRYPTION_SECRET'));
  } catch (err) {
    throw { statusCode: 1208 };
  }
}

export async function getUserFromToken(token: string) {
  const { email } = await verifyToken(token);
  return await getUser(email);
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

export function buildTypeOrmParams(params: {}): string {
  let whereStatement = '';
  const statement = Object.keys(params);
  statement.forEach((key, index) => {
    whereStatement += ` ${key}= :${key} ${
      index < statement.length - 1 ? ' and ' : ''
    } `;
  });
  return whereStatement;
}
