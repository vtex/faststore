FastStore CLI
=================

<!-- toc -->
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
@faststore/cli/0.2.0 darwin-arm64 node-v16.18.0
$ faststore --help [COMMAND]
USAGE
  $ faststore COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`faststore build`](#faststore-build)
* [`faststore dev`](#faststore-dev)
* [`faststore help [COMMAND]`](#faststore-help-command)
* [`faststore start`](#faststore-start)

## `faststore build`

```
USAGE
  $ faststore build
```

_See code: [dist/commands/build.ts](https://github.com/vtex/faststore/blob/v0.2.0/dist/commands/build.ts)_

## `faststore dev`

```
USAGE
  $ faststore dev
```

_See code: [dist/commands/dev.ts](https://github.com/vtex/faststore/blob/v0.2.0/dist/commands/dev.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.14/src/commands/help.ts)_

## `faststore start`

```
USAGE
  $ faststore start
```

_See code: [dist/commands/start.ts](https://github.com/vtex/faststore/blob/v0.2.0/dist/commands/start.ts)_
<!-- commandsstop -->
