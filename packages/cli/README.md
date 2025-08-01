<p align="center">
  <a href="https://faststore.dev">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  FastStore CLI
</h1>
<p align="center">
  <strong>
    The FastStore Command Line Interface
  </strong>
</p>

The FastStore Command Line Interface (CLI) is the main pre-configured tool for initializing, building and developing FastStore projects.

Also the CLI is the responsible on keeping the stores up-to-date with the `@faststore/core` package and enables the cloud platform to understand the FastStore project.

## Installation

From the command line in your project directory, run:

```cmd
npm install -g @faststore/cli
```

<!-- usage -->
```sh-session
$ npm install -g @faststore/cli
$ faststore COMMAND
running command...
$ faststore (--version)
@faststore/cli/3.70.0 linux-x64 node-v18.20.8
$ faststore --help [COMMAND]
USAGE
  $ faststore COMMAND
...
```
<!-- usagestop -->

## Commands

<!-- commands -->
* [`faststore build [ACCOUNT] [PATH]`](#faststore-build-account-path)
* [`faststore cms-sync [PATH]`](#faststore-cms-sync-path)
* [`faststore create [PATH]`](#faststore-create-path)
* [`faststore dev [ACCOUNT] [PATH] [PORT]`](#faststore-dev-account-path-port)
* [`faststore generate-graphql [PATH]`](#faststore-generate-graphql-path)
* [`faststore help [COMMAND]`](#faststore-help-command)
* [`faststore start [ACCOUNT] [PATH] [PORT]`](#faststore-start-account-path-port)
* [`faststore test [PATH]`](#faststore-test-path)

## `faststore build [ACCOUNT] [PATH]`

```
USAGE
  $ faststore build [ACCOUNT] [PATH] [--no-verify]

ARGUMENTS
  ACCOUNT  The account for which the Discovery is running. Currently noop.
  PATH     The path where the FastStore being built is. Defaults to cwd.

FLAGS
  --no-verify  Skips verification of faststore dependencies version string to prevent usage of packages outside npm
               registry.
```

_See code: [dist/commands/build.js](https://github.com/vtex/faststore/blob/v3.70.0/dist/commands/build.js)_

## `faststore cms-sync [PATH]`

```
USAGE
  $ faststore cms-sync [PATH] [-d]

ARGUMENTS
  PATH  The path where the FastStore being synched with the CMS is. Defaults to cwd.

FLAGS
  -d, --dry-run
```

_See code: [dist/commands/cms-sync.js](https://github.com/vtex/faststore/blob/v3.70.0/dist/commands/cms-sync.js)_

## `faststore create [PATH]`

Creates a discovery folder based on the starter.store template.

```
USAGE
  $ faststore create [PATH]

ARGUMENTS
  PATH  The path where the Discovery folder will be created. Defaults to ./discovery.

DESCRIPTION
  Creates a discovery folder based on the starter.store template.

EXAMPLES
  $ yarn faststore create discovery
```

_See code: [dist/commands/create.js](https://github.com/vtex/faststore/blob/v3.70.0/dist/commands/create.js)_

## `faststore dev [ACCOUNT] [PATH] [PORT]`

```
USAGE
  $ faststore dev [ACCOUNT] [PATH] [PORT]

ARGUMENTS
  ACCOUNT  The account for which the Discovery is running. Currently noop.
  PATH     The path where the FastStore being run is. Defaults to cwd.
  PORT     The port where FastStore should run. Defaults to 3000.
```

_See code: [dist/commands/dev.js](https://github.com/vtex/faststore/blob/v3.70.0/dist/commands/dev.js)_

## `faststore generate-graphql [PATH]`

```
USAGE
  $ faststore generate-graphql [PATH]

ARGUMENTS
  PATH  The path where the FastStore GraphQL customization is. Defaults to cwd.
```

_See code: [dist/commands/generate-graphql.js](https://github.com/vtex/faststore/blob/v3.70.0/dist/commands/generate-graphql.js)_

## `faststore help [COMMAND]`

Display help for faststore.

```
USAGE
  $ faststore help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for faststore.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.22/src/commands/help.ts)_

## `faststore start [ACCOUNT] [PATH] [PORT]`

```
USAGE
  $ faststore start [ACCOUNT] [PATH] [PORT]

ARGUMENTS
  ACCOUNT  The account for which the Discovery is running. Currently noop.
  PATH     The path where the FastStore being run is. Defaults to cwd.
  PORT     The port where FastStore should run. Defaults to 3000.
```

_See code: [dist/commands/start.js](https://github.com/vtex/faststore/blob/v3.70.0/dist/commands/start.js)_

## `faststore test [PATH]`

```
USAGE
  $ faststore test [PATH]

ARGUMENTS
  PATH  The path where the FastStore being tested is. Defaults to cwd.
```

_See code: [dist/commands/test.js](https://github.com/vtex/faststore/blob/v3.70.0/dist/commands/test.js)_
<!-- commandsstop -->
