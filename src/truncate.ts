import { DataSource } from 'typeorm';

export async function truncateTables(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE \"${entity.tableName}\" CASCADE`);
  }
}


