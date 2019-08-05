import { getConnection } from 'typeorm';

export async function insertDB(model: any, data: any) {
  return await getConnection()
    .createQueryBuilder()
    .insert()
    .into(model)
    .values(data)
    .execute();
}
