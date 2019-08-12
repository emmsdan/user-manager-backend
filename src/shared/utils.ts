import { getConnection, getRepository } from 'typeorm';
import 'reflect-metadata';
import { classToPlain } from 'class-transformer';

import { User } from '../db/models/User';
import { buildTypeOrmParams } from './helpers/helpers';

export async function insertDB(model: any, data: any) {
  return await getConnection()
    .createQueryBuilder()
    .insert()
    .into(model)
    .values(data)
    .execute();
}

export async function updateDB(model: any, data: any, where: any) {
  return await getConnection()
    .createQueryBuilder()
    .update(model)
    .set(data)
    .where(buildTypeOrmParams(where))
    .setParameters(where)
    .returning(Object.keys({ ...data, ...where }))
    .execute();
}

export async function getUser(email: string): Promise<any> {
  return await getRepository(User)
    .find({ where: { email } })
    .then((user) => {
      return user[0];
    });
}
