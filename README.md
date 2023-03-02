# typeorm-truncate-all
This package simplifies the process of resetting the database to a clean state during testing or development by executing a PostgreSQL query to truncate all tables with cascade. 

The function can be easily integrated into a NestJS application by injecting the existing TypeORM instance.


## How to

- `npm i typeorm-truncate-all`

- `import { truncateTables } from "typeorm-truncate-all"`;

- call `truncateTables` function with the DataSource object from TypeORM instance

## Example

```
export class SeedService {
    constructor(
        private dataSource: DataSource,
    ) {}

    async drop() {
        try {
            truncateTables(this.dataSource);
        } catch (e) {
            return new Error(`Encountered error dropping data:${e}`);
        }
    }
}
```
