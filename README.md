# typeorm-truncate-all
This package simplifies the process of resetting the database to a clean state during testing or development by executing a PostgreSQL query to truncate all tables with cascade. 

The function can be easily integrated into a NestJS application by injecting the existing TypeORM instance.


## How to

- `npm i typeorm-truncate-all`

- `import { truncateTables } from "typeorm-truncate-all"`;

- call `truncateTables` function with the DataSource object from TypeORM instance

## Example

```
import { DataSource } from 'typeorm';
import { truncateTables } from 'typeorm-truncate-all';

export class SeedService {
  constructor(private dataSource: DataSource) {}

  async drop() {
    try {
      await truncateTables(this.dataSource, ['table_to_exclude'], {
        onTableTruncated: (tableName: string) => {
          console.log(`Table ${tableName} truncated successfully`);
        },
        onError: (tableName: string, error: Error) => {
          console.error(`Error truncating table ${tableName}:`, error);
        },
      });
    } catch (e) {
      return new Error(`Encountered error dropping data: ${e}`);
    }
  }
}
```
