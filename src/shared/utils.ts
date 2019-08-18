import { getConnection, getRepository } from 'typeorm';
import 'reflect-metadata';
import { classToPlain } from 'class-transformer';

import { User } from '../db/models/User';
import { buildTypeOrmParams, hash } from './helpers/helpers';
import { PasswordManager } from '../db/models/PasswordManager';

/**
 * insertDB
 * @description insert data into table
 * @param model Table Entities ie. User
 * @param data data to insertinto Table
 */
export async function insertDB(model: any, data: any) {
  return await getConnection()
    .createQueryBuilder()
    .insert()
    .into(model)
    .values(data)
    .execute();
}

/**
 * updateDB
 * @description update a table in the database
 * @param model Table Entities ie. User
 * @param data what is to be updated
 * @param where where is to be updated
 */
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

/**
 * getUser
 * @description get user with this email
 * @param email string
 */
export async function getUser(email: string): Promise<any> {
  const where = { where: { email } };
  return await getRepository(User)
    .findOne(where)
    .then((user) => user);
}

/**
 * getTableById
 * @description get user with this email
 * @param model Table Entities
 * @param email string
 */
export async function getTableById(model: any, id: string): Promise<any> {
  return await getRepository(model)
    .find({ where: { id } })
    .then((response) => {
      return response[0];
    });
}

/**
 * activateUser
 * @description activate a new users account
 * @param userInfo object containing users info
 */
export async function activateUser(userInfo: {
  id: number;
  company: string;
  email: string;
  password: string;
}) {
  const { id, company, email, password } = userInfo;
  return await Promise.all([
    insertDB(PasswordManager, [{ currentPassword: await hash(password), id }]),
    updateDB(
      User,
      { isActive: true, company, requestToken: '' },
      { id, email }
    ),
  ]);
}
