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
@faststore/cli/3.93.0-dev.2 darwin-arm64 node-v22.19.0
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
* [`faststore dev [PATH] [ACCOUNT] [PORT]`](#faststore-dev-path-account-port)
* [`faststore generate`](#faststore-generate)
* [`faststore help [COMMAND]`](#faststore-help-command)
* [`faststore prepare [PATH]`](#faststore-prepare-path)
* [`faststore serve [ACCOUNT] [PATH] [PORT]`](#faststore-serve-account-path-port)
* [`faststore test [PATH]`](#faststore-test-path)

## `faststore build [ACCOUNT] [PATH]`

```
USAGE
  $ faststore build [ACCOUNT] [PATH] [--no-verify]

ARGUMENTS
  [ACCOUNT]  The account for which the Discovery is running. Currently noop.
  [PATH]     The path where the FastStore being built is. Defaults to cwd.

FLAGS
  --no-verify  Skips verification of faststore dependencies version string to prevent usage of packages outside npm
               registry.
```

## `faststore cms-sync [PATH]`

```
USAGE
  $ faststore cms-sync [PATH] [-d]

ARGUMENTS
  [PATH]  The path where the FastStore being synched with the CMS is. Defaults to cwd.

FLAGS
  -d, --dry-run
```

## `faststore create [PATH]`

Creates a discovery folder based on the starter.store template.

```
USAGE
  $ faststore create [PATH]

ARGUMENTS
  [PATH]  The path where the Discovery folder will be created. Defaults to ./discovery.

DESCRIPTION
  Creates a discovery folder based on the starter.store template.

EXAMPLES
  $ yarn faststore create discovery
```

## `faststore dev [PATH] [ACCOUNT] [PORT]`

```
USAGE
  $ faststore dev [PATH] [ACCOUNT] [PORT] [--watch-plugins]

ARGUMENTS
  [PATH]     The path where the FastStore being run is. Defaults to cwd.
  [ACCOUNT]  The account for which the Discovery is running. Currently noop.
  [PORT]     The port where FastStore should run. Defaults to 3000.

FLAGS
  --watch-plugins  Enable watching for plugin changes
```

## `faststore generate`

```
USAGE
  $ faststore generate
```

## `faststore help [COMMAND]`

Display help for faststore.

```
USAGE
  $ faststore help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for faststore.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.35/src/commands/help.ts)_

## `faststore prepare [PATH]`

```
USAGE
  $ faststore prepare [PATH]

ARGUMENTS
  [PATH]  The path where the FastStore being run is. Defaults to cwd.
```

## `faststore serve [ACCOUNT] [PATH] [PORT]`

```
USAGE
  $ faststore serve [ACCOUNT] [PATH] [PORT]

ARGUMENTS
  [ACCOUNT]  The account for which the Discovery is running. Currently noop.
  [PATH]     The path where the FastStore being run is. Defaults to cwd.
  [PORT]     The port where FastStore should run. Defaults to 3000.
```

## `faststore test [PATH]`

```
USAGE
  $ faststore test [PATH]

ARGUMENTS
  [PATH]  The path where the FastStore being tested is. Defaults to cwd.
```
<!-- commandsstop -->
