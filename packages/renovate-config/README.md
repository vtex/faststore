# @vtex/renovate-config

> Renovate preset JSON config

## Install

`yarn add @vtex/renovate-config`

Doesn't need to install as a dependency if used as a [GitHub-hosted Preset](https://docs.renovatebot.com/config-presets/#github-hosted-presets).

## Usage

In any store project, after [installing Renovate app inside your repository](https://docs.renovatebot.com/install-github-app/), insert the `extends` option inside `renovate.json`.

If used as a [GitHub-hosted Preset](https://docs.renovatebot.com/config-presets/#github-hosted-presets):

```json
// renovate.json

{
  ...,
  "extends": ["git:vtex/faststore/packages/renovate-config"],
  ...
}
```

If used as a [NPM-hosted preset](https://docs.renovatebot.com/config-presets/#npm-hosted-presets):

```json
// renovate.json

{
  ...
  "extends": ["@vtex/renovate-config"],
  ...
}
```

## License

MIT © [VTEX](https://github.com/vtex)
