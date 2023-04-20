// truncateTables.test.ts

import { DataSource, DataSourceOptions } from 'typeorm';
import { truncateTables } from '../src/truncate';

jest.mock('typeorm');

describe('truncateTables', () => {
  let dataSource;
  let entity1: any;
  let entity2: any;

  beforeEach(() => {
    dataSource = {} as DataSource;
    entity1 = {
      tableName: 'test_table_1',
      name: 'TestTable1',
    };
    entity2 = {
      tableName: 'test_table_2',
      name: 'TestTable2',
    };

    dataSource.entityMetadatas = [entity1, entity2];
  });

  test('should truncate all tables if excludeTables is empty', async () => {
    const repo1 = {
      query: jest.fn(),
    };
    const repo2 = {
      query: jest.fn(),
    };

    dataSource.getRepository = jest.fn().mockImplementation((name) => {
      if (name === entity1.name) return repo1;
      if (name === entity2.name) return repo2;
      return null;
    });

    await truncateTables(dataSource);

    expect(dataSource.getRepository).toHaveBeenCalledWith(entity1.name);
    expect(dataSource.getRepository).toHaveBeenCalledWith(entity2.name);
    expect(repo1.query).toHaveBeenCalledWith(`TRUNCATE TABLE "${entity1.tableName}" CASCADE`);
    expect(repo2.query).toHaveBeenCalledWith(`TRUNCATE TABLE "${entity2.tableName}" CASCADE`);
  });

  test('should not truncate tables in excludeTables', async () => {
    const repo1 = {
      query: jest.fn(),
    };
    const repo2 = {
      query: jest.fn(),
    };

    dataSource.getRepository = jest.fn().mockImplementation((name) => {
      if (name === entity1.name) return repo1;
      if (name === entity2.name) return repo2;
      return null;
    });

    await truncateTables(dataSource, [entity1.tableName]);

    expect(dataSource.getRepository).not.toHaveBeenCalledWith(entity1.name);
    expect(dataSource.getRepository).toHaveBeenCalledWith(entity2.name);
    expect(repo1.query).not.toHaveBeenCalled();
    expect(repo2.query).toHaveBeenCalledWith(`TRUNCATE TABLE "${entity2.tableName}" CASCADE`);
  });

  test('should call onTableTruncated after table is truncated', async () => {
    const repo1 = {
      query: jest.fn(),
    };

    dataSource.getRepository = jest.fn().mockReturnValue(repo1);
    dataSource.entityMetadatas = [entity1];

    const onTableTruncated = jest.fn();
    const onError = jest.fn();

    await truncateTables(dataSource, [], { onTableTruncated, onError });

    expect(onTableTruncated).toHaveBeenCalledWith(entity1.tableName);
    expect(onError).not.toHaveBeenCalled();
  });

  test('should call onError if an error occurs while truncating a table', async () => {
    const error = new Error('Test error');
    const repo1 = {
      query: jest.fn().mockRejectedValue(error),
    };

    dataSource.getRepository = jest.fn().mockReturnValue(repo1);
    dataSource.entityMetadatas = [entity1];

    const onTableTruncated = jest.fn();
    const onError = jest.fn();

    await truncateTables(dataSource, [], { onTableTruncated, onError });

    expect(onTableTruncated).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(entity1.tableName, error);
  });
});

