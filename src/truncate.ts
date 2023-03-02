import { DataSource } from 'typeorm';

// export async function truncateAllTables(source: DataSource) {
//   await source.query(`
//     DO $$ DECLARE
//       tabname RECORD;
//     BEGIN
//       FOR tabname IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
//         EXECUTE 'TRUNCATE TABLE ' || tabname.tablename || ' CASCADE;';
//       END LOOP;
//     END $$;
//   `);
// }

export async function truncateTables(dataSource: DataSource) {
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE ${entity.tableName} CASCADE`);
  }
}
