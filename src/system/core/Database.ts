import { Container, Service } from 'typedi'
import { createConnection } from 'typeorm'
import { Config } from './Config'

@Service('database')
export class Database {
  constructor() {
    const config = Container.get<Config>(Config)
    createConnection({
      type: 'postgres',
      host: config.get('database.host'),
      username: config.get('database.username'),
      password: config.get('database.password'),
      database: config.get('database.database'),
      port: config.get('database.port'),
      synchronize: config.get('database.synchronize', false),
      logging: config.get('database.logging', true),
    }).catch((error) => {
      console.log(error.message)
    })
  }
}
