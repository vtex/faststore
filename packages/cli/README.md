# FastStore CLI

<!-- toc -->
* [FastStore CLI](#faststore-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @faststore/cli
$ faststore COMMAND
running command...
$ faststore (--version)
@faststore/cli/2.2.5 linux-x64 node-v16.20.2
$ faststore --help [COMMAND]
USAGE
  $ faststore COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`faststore build`](#faststore-build)
* [`faststore cms-sync`](#faststore-cms-sync)
* [`faststore dev`](#faststore-dev)
* [`faststore generate-graphql`](#faststore-generate-graphql)
* [`faststore help [COMMAND]`](#faststore-help-command)
* [`faststore start`](#faststore-start)
* [`faststore test`](#faststore-test)

## `faststore build`

```
USAGE
  $ faststore build
```

_See code: [dist/commands/build.ts](https://github.com/vtex/faststore/blob/v2.2.5/dist/commands/build.ts)_

## `faststore cms-sync`

```
USAGE
  $ faststore cms-sync
```

_See code: [dist/commands/cms-sync.ts](https://github.com/vtex/faststore/blob/v2.2.5/dist/commands/cms-sync.ts)_

## `faststore dev`

```
USAGE
  $ faststore dev
```

_See code: [dist/commands/dev.ts](https://github.com/vtex/faststore/blob/v2.2.5/dist/commands/dev.ts)_

## `faststore generate-graphql`

```
USAGE
  $ faststore generate-graphql [-d]

FLAGS
  -d, --debug
```

_See code: [dist/commands/generate-graphql.ts](https://github.com/vtex/faststore/blob/v2.2.5/dist/commands/generate-graphql.ts)_

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

## `faststore start`

```
USAGE
  $ faststore start
```

_See code: [dist/commands/start.ts](https://github.com/vtex/faststore/blob/v2.2.5/dist/commands/start.ts)_

## `faststore test`

```
USAGE
  $ faststore test
```

_See code: [dist/commands/test.ts](https://github.com/vtex/faststore/blob/v2.2.5/dist/commands/test.ts)_
<!-- commandsstop -->
