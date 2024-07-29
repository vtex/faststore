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
@faststore/cli/3.0.89 linux-x64 node-v18.20.4
$ faststore --help [COMMAND]
USAGE
  $ faststore COMMAND
...
```
<!-- usagestop -->

## Commands

<!-- commands -->
* [`faststore build [PATH]`](#faststore-build-path)
* [`faststore cms-sync [PATH]`](#faststore-cms-sync-path)
* [`faststore dev [PATH]`](#faststore-dev-path)
* [`faststore generate-graphql [PATH]`](#faststore-generate-graphql-path)
* [`faststore help [COMMAND]`](#faststore-help-command)
* [`faststore init [PATH]`](#faststore-init-path)
* [`faststore start [PATH]`](#faststore-start-path)
* [`faststore test [PATH]`](#faststore-test-path)

## `faststore build [PATH]`

```
USAGE
  $ faststore build [PATH]

ARGUMENTS
  PATH  The path where the FastStore being built is. Defaults to cwd.
```

_See code: [dist/commands/build.ts](https://github.com/vtex/faststore/blob/v3.0.89/dist/commands/build.ts)_

## `faststore cms-sync [PATH]`

```
USAGE
  $ faststore cms-sync [PATH] [-d]

ARGUMENTS
  PATH  The path where the FastStore being synched with the CMS is. Defaults to cwd.

FLAGS
  -d, --dry-run
```

_See code: [dist/commands/cms-sync.ts](https://github.com/vtex/faststore/blob/v3.0.89/dist/commands/cms-sync.ts)_

## `faststore dev [PATH]`

```
USAGE
  $ faststore dev [PATH]

ARGUMENTS
  PATH  The path where the FastStore being run is. Defaults to cwd.
```

_See code: [dist/commands/dev.ts](https://github.com/vtex/faststore/blob/v3.0.89/dist/commands/dev.ts)_

## `faststore generate-graphql [PATH]`

```
USAGE
  $ faststore generate-graphql [PATH] [-d]

ARGUMENTS
  PATH  The path where the FastStore GraphQL customization is. Defaults to cwd.

FLAGS
  -d, --debug
```

_See code: [dist/commands/generate-graphql.ts](https://github.com/vtex/faststore/blob/v3.0.89/dist/commands/generate-graphql.ts)_

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

## `faststore init [PATH]`

Creates a discovery folder based on the starter.store template.

```
USAGE
  $ faststore init [PATH]

ARGUMENTS
  PATH  The path where the Discovery folder will be created. Defaults to ./discovery.

DESCRIPTION
  Creates a discovery folder based on the starter.store template.

EXAMPLES
  $ yarn faststore init discovery
```

_See code: [dist/commands/init.ts](https://github.com/vtex/faststore/blob/v3.0.89/dist/commands/init.ts)_

## `faststore start [PATH]`

```
USAGE
  $ faststore start [PATH]

ARGUMENTS
  PATH  The path where the FastStore being run is. Defaults to cwd.
```

_See code: [dist/commands/start.ts](https://github.com/vtex/faststore/blob/v3.0.89/dist/commands/start.ts)_

## `faststore test [PATH]`

```
USAGE
  $ faststore test [PATH]

ARGUMENTS
  PATH  The path where the FastStore being tested is. Defaults to cwd.
```

_See code: [dist/commands/test.ts](https://github.com/vtex/faststore/blob/v3.0.89/dist/commands/test.ts)_
<!-- commandsstop -->
