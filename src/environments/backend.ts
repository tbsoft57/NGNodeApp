export const environment = {
  appName: 'NGNodeApp',
  origin: 'app1.tbsoft.fr',
  apiPrefix: 'api',
  ormconfig: {
    type: 'sqljs',
    location: './sqlite/database.sqlite',
    host: '',
    port: '',
    user: '',
    pass: '',
    synchronize: true,
    autoSave: true,
    logging: false,
    entities: ['./src/api/entities/**/*.ts'],
    migrations: ['./src/api/migration/**/*.ts'],
    subscribers: ['./src/api/subscriber/**/*.ts'],
    cli: { entitiesDir: './src/api/entities', migrationsDir: './src/api/migration', subscribersDir: './src/api/subscriber' },
    extra: { connectionLimit: 5 }
  }
};
