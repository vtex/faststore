import degit from 'degit'
import { Command } from '@oclif/core';

export default class Init extends Command {
  async run() {
    const discoveryEmitter = degit('vtex-sites/starter.store')

    this.log('Pulling starter.store template...')

    discoveryEmitter.on('info', info => {
      this.log(info.message)
    })

    discoveryEmitter.clone('discovery').then(() => {
      this.log('Discovery created successfuly! You can find it at discovery/')
    })
  }
}
