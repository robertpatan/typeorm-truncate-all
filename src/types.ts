import { DataSource } from "typeorm";

export declare function truncateTables(dataSource: DataSource): Promise<void>;
