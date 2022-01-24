export const database = {
  type: process.env['DB_TYPE'] || 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  username: process.env['DB_USERNAME'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'postgres',
  database: process.env['DB_DATABASE'] || 'paketa',
  port: process.env['DB_PORT'] || 5432,
  synchronize: process.env['DB_SYNCHRONIZE'] || false,
  logging: process.env['DB_LOGGING'] || false,
}
