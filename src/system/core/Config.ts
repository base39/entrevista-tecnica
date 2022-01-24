import { readdir } from 'fs/promises'
import _ from 'lodash'
import dotenv from 'dotenv'
import { Service } from 'typedi'

@Service()
export class Config {
  private static instance: Config
  private configs:
    | {
        [key: string]: object
      }
    | object = {}

  constructor(private readonly configPath: string) {
    dotenv.config()
  }

  static async loadFromPath(configPath: string) {
    if (!this.instance) {
      this.instance = new Config(configPath)
      await this.instance.load()
    }
    return this.instance
  }

  private async load() {
    const configPath = this.configPath
    const configFiles: string[] = await readdir(configPath)
    for (const fileName of configFiles) {
      const classes = await import(configPath + '/' + fileName)
      for (let configName of Object.keys(classes)) {
        configName = _.snakeCase(configName)
        this.configs[configName] = Object.assign(classes[configName] || {}, {})
      }
    }
  }

  /**
   * @param key
   * @param defaultValue
   */
  public get(key: string, defaultValue: any = null): any {
    return _.get(this.configs, key, defaultValue)
  }
}
