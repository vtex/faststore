import chalk from 'chalk'
import {
  copySync,
  existsSync,
  mkdirsSync,
  readdirSync,
  removeSync,
} from 'fs-extra'
import { getRoot } from './directory'
import path from 'path'

const tmpDir = path.join(getRoot(), './packages/apps/client')
const tmpCustomizationsDir = path.join(
  getRoot(),
  './packages/apps/client/src/customizations'
)
const baseCheckoutDir = path.join(getRoot(), './packages/apps/.client-base')
const userCheckoutDir = path.join(getRoot(), './packages/apps/checkout')

function cleanCustomizationsFolder() {
  try {
    if (existsSync(tmpCustomizationsDir)) {
      removeSync(tmpCustomizationsDir)
    }

    mkdirsSync(tmpCustomizationsDir)
    console.log(
      `${chalk.green('success')} - Customizations folder cleared`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

function copyBaseFiles() {
  try {
    copySync(baseCheckoutDir, tmpDir)

    console.log(`${chalk.green('success')} - Base files copied`)
  } catch (e) {
    console.error(e)
  }
}

function copyUserCheckoutToCustomizations() {
  try {
    if (
      existsSync(userCheckoutDir) &&
      readdirSync(userCheckoutDir).length > 0
    ) {
      copySync(userCheckoutDir, tmpCustomizationsDir)
    }

    console.log(`${chalk.green('success')} - Checkout files copied`)
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

export function generateCheckout({
  setup,
}: { setup?: boolean } | undefined = {}) {
  let setupPromise: Promise<unknown> | null = null

  if (setup) {
    setupPromise = Promise.all([cleanCustomizationsFolder(), copyBaseFiles()])
  }

  // copy user file
  return Promise.all([setupPromise, copyUserCheckoutToCustomizations()])
}
