import { DataSource } from 'typeorm';

export async function truncateTables(
  dataSource: DataSource,
  options: {
    onTableTruncated?: (tableName: string) => void;
    onError?: (tableName: string, error: Error) => void;
  } = {}
): Promise<void> {
  const { onTableTruncated, onError } = options;
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    try {
      await repository.query(`TRUNCATE TABLE \"${entity.tableName}\" CASCADE`);
      if (onTableTruncated) onTableTruncated(entity.tableName);
    } catch (error) {
      if (onError) onError(entity.tableName, error);
      console.error(`Error truncating table ${entity.tableName}:`, error);
    }
  }
}

export async function truncateTablesWithExclude(
  dataSource: DataSource,
  excludeTables: string[] = []
): Promise<void> {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    if (excludeTables.includes(entity.tableName)) continue;

    const repository = dataSource.getRepository(entity.name);
    try {
      await repository.query(`TRUNCATE TABLE \"${entity.tableName}\" CASCADE`);
    } catch (error) {
      console.error(`Error truncating table ${entity.tableName}:`, error);
    }
  }
}


