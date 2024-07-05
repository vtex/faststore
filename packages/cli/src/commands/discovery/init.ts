import fs from 'node:fs';
import degit from 'degit';
import { Command } from '@oclif/core';
import { confirm } from '@inquirer/prompts'

export default class Init extends Command {
  static description = "Creates a discovery folder based on the starter.store template.";

  static examples = ["$ yarn faststore discovery init"];

  async run() {
    const discoveryFolderExists = fs.existsSync('discovery');

    if (discoveryFolderExists) {
      const confirmOverride = await confirm({ message: 'It looks like you already have a discovery folder in your store. Do you want to override it?' });

      if (!confirmOverride) return this.log('🛑 Interrupted initializing discovery');
    }

    const discoveryEmitter = degit('vtex-sites/starter.store', {
      force: true
    });

    this.log('Pulling starter.store template...');

    discoveryEmitter.clone('discovery').then(() => {
      this.log('Discovery created successfuly! You can find it at discovery/');
    })
  }
}
