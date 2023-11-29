# How to contribute

1. Fork this repository.

2. Clone your forked `faststore` repository.

3. Create a new branch for the changes you are working on.

## Developing Locally

### Developing Packages

1. Run `yarn` at the root of the repo.

2. Run `yarn build` at the root of the repo.

3. Run `yarn turbo run dev --filter={packageName}` to run a package individually.

> For example, if you want to run the `@faststore/core` package, at the root of the repo run:
>
> `yarn turbo run dev --filter=@faststore/core`

### Developing packages while also testing on a store

To test your changes in a store, you will need to create a pull request (for more guidance, refer to the next section). You can keep your pull request in `draft` while testing.

1. After committing your changes, push them to the remote repo and open a Pull Request.

2. In the checks section, find `ci/codesandbox` and click on `Details`.

<img width="502" alt="checks_details" src="https://vtexhelp.vtexassets.com/assets/docs/src/dropdown-menu-example___338a9acd1892074ba750ada043ab92b4.png"></img>

3. Use the `Local Install Instructions` provided for the PR to **add your version of the packages** as dependencies in the `package.json` file of the [starter](https://github.com/vtex-sites/starter.store) or your store.

<img width="502" alt="image" src="https://vtexhelp.vtexassets.com/assets/docs/src/fs-package-local-install___db14cf215e613a08aca9ba5d779eb37a.png"></img>

4. Run `yarn` to install the updates and test your changes.

## Creating Pull Requests

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for pull request titles and commit messages.

1. After committing your changes, push them to the remote repo and open a Pull Request.

2. Please add a clear and concise title PR title with one of the prefixes.

- Available prefixes: `feat`, `fix`, `chore`, `docs`, `style`
- Example: `feat: Add Carousel component`

3. You will be presented with a pull request template. Kindly describe the motivation behind and the changes you made. This information will help reviewers in understanding your contributions.

4. Wait for checks to pass and reviews to be approved.

5. When your changes are merged, a new release will be initiated, incorporating your updates into the latest version.

Thanks for contributing 🎉
