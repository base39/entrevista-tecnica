import { Application } from './system/core/Application'
import 'reflect-metadata'

Application.instance(__dirname).then((app) => {
  app.httpServer()
})
