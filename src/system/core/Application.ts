import path from 'path'
import { AbstractProvider } from '../providers/AbstractProvider'
import { Config } from './Config'
import { Container as ContainerTo } from 'typeorm-typedi-extensions'
import { Container } from 'typedi'
import { providers } from '../providers/registry'
import {
  createExpressServer,
  useContainer as rcUseContainer,
} from 'routing-controllers'
import { useContainer as tpUseContainer } from 'typeorm'
import express from 'express'

rcUseContainer(Container)
tpUseContainer(ContainerTo)

export class Application {
  private static _application: Application
  private _providers: AbstractProvider[] = []
  private _systemDirectoryPath: string = path.join(this.basePath, 'system')
  private _configDirectoryPath: string = path.join(
    this._systemDirectoryPath,
    'config'
  )
  private _httpDirectory: string = path.join(this._systemDirectoryPath, 'http')
  private _controllerFiles: string = path.join(
    this._httpDirectory,
    '/controllers/**/*.ts'
  )
  private _express?: express.Application

  static get application(): Application {
    return this._application
  }

  get providers(): AbstractProvider[] {
    return this._providers
  }

  get systemDirectoryPath(): string {
    return this._systemDirectoryPath
  }

  get configDirectoryPath(): string {
    return this._configDirectoryPath
  }

  get httpDirectory(): string {
    return this._httpDirectory
  }

  get controllerFiles(): string {
    return this._controllerFiles
  }

  /**
   *
   * @param basePath
   */
  public static async instance(basePath: string): Promise<Application> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this._application) {
          this._application = new Application(basePath)
          await this._application.init()
        }
        resolve(this._application)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   *
   * @param basePath
   */
  constructor(private readonly basePath: string) {
    this.basePath = basePath
  }

  /**
   *
   * @private
   */
  private async init() {
    await this.loadConfig()
    await this.loadProviders()
    await this.providerRegister()
    await this.providerBoot()
  }

  /**
   *
   * @private
   */
  private async loadProviders() {
    for (const provider of Object.keys(providers)) {
      this._providers.push(new providers[provider](this))
    }
  }

  /**
   *
   * @private
   */
  private async loadConfig() {
    const config = await Config.loadFromPath(this._configDirectoryPath)
    Container.set<Config>(Config, config)
  }

  /**
   *
   * @private
   */
  private async providerRegister() {
    this._providers.forEach((provider) => {
      provider.register()
    })
  }

  /**
   *
   * @private
   */
  private async providerBoot() {
    this._providers.forEach((provider) => {
      provider.boot()
    })
  }

  public httpServer(port: number = 3000): void {
    this._express = createExpressServer({
      controllers: [this._controllerFiles],
    }).listen(port)
  }
}
