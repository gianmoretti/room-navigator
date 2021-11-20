import {
  Category,
  CategoryConfiguration,
  CategoryServiceFactory,
  LogLevel,
} from 'typescript-logging';

CategoryServiceFactory.setDefaultConfiguration(
  new CategoryConfiguration(LogLevel.Info),
);

export const logger = new Category('calc-path');
