import degit from 'degit'
import { Command } from '@oclif/core'

export default class Init extends Command {
  static description = 'Initialize the discovery module'

  async run() {
    this.log('Initializing discovery module...')

    const emitter = degit('vtex-sites/starter.store')
    await emitter.clone('./discovery')
    this.log('Done')
  }
}
