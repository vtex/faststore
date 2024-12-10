# How to contribute 🌟

Thank you for your interest in contributing! We welcome all kinds of contributions, whether they are bug fixes, new features, documentation improvements, or any other suggestions. This guide will walk you through the process of contributing to FastStore framework.

## 1. Requirements

Before you begin, make sure you have the following installed on your local machine to run the project:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com/)
- [Turbo](https://turbo.build/repo/docs/getting-started/installation#installing-turbo)
- Your Preferred Code Editor (VSCode, Sublime, etc.)

## 2. Getting Started

### Forking the Repository

**If you don’t have write access to this repository**, you'll need to fork it (else, skip this step):

Fork the repository (click the <kbd>Fork</kbd> button at the top right of
[this page](https://github.com/vtex/faststore)).This will create a copy of the repository in your GitHub account.

### Cloning the Repository

1. Open a terminal and clone the `faststore` repository.
2. Navigate into the project folder.

### Setting Up the Environment

1. Run `yarn` at the root of the repository.

2. Run `yarn build` at the root of the repository.

3. Run `yarn turbo run dev --filter={packageName}` to run a package individually.

> For example, if you want to run the `@faststore/core` package, at the root of the repository run:
>
> `yarn turbo run dev --filter=@faststore/core`

**Note**: If you encounter issues during the setup process, please check if your current version of Yarn, Turbo, and Node.js are matching the versions specified in the package.json file.

## 3. Working on an Issue

### Creating a New Branch

Before starting any work, create a new branch for your changes:

```
git checkout -b feat/your-branch-name
```

Choose a branch name that reflects the work being done, such as `fix/query-typo` or `feat/add-new-component`.

### Testing Changes on a Store

To test your changes in a store, you will need to create a pull request (for more guidance, refer to the next section). You can keep your pull request in `draft` while testing.

1. After committing your changes, push them to the remote repository and open a Pull Request.

2. In the checks section, find `ci/codesandbox` and click on `Details`.

<img width="502" alt="checks_details" src="https://vtexhelp.vtexassets.com/assets/docs/src/dropdown-menu-example___338a9acd1892074ba750ada043ab92b4.png"></img>

3. Use the `Local Install Instructions` provided for the PR to **add your version of the packages** as dependencies in the `package.json` file of the [starter](https://github.com/vtex-sites/starter.store) or your store.

<img width="502" alt="image" src="https://vtexhelp.vtexassets.com/assets/docs/src/fs-package-local-install-cli___692a64eba8c0b3745c468176bfc610fb.png
"></img>

4. Run `yarn` to install the updates and test your changes in the store.

**Note**: This link is intended for testing purposes only. Please avoid using it in your store. Once the published version of your package is available, make sure to update the link accordingly.

## 4. Creating a Pull Request

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for pull request titles and commit messages.

After committing your changes, push them to the remote repository and open a Pull Request.

### Pull Request Guidelines

1. Please add a clear and concise title PR title with one of the prefixes.

- Available prefixes: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `ci` and `test`
- Example: `Feat: Add Carousel component`

2. You will be presented with a pull request template. Please describe the motivation behind your changes and provide details about what you have implemented.

3. If applicable, include screenshots and steps for testing. This information will help reviewers understand your contributions better.

4. Add the `contributing` label to identify your PR. And any other [label](https://github.com/vtex/faststore/labels) that is applicable for your PR.

**Note**: If you believe your changes might cause a breaking change, or if you have any concerns about it, please mention this in the pull request description.

## 5. Review Process

Once your PR is submitted, the team will review it.

Pull requests need only the approval 👍 of two or more maintainers to be merged.

All contributions will go through a review process. Make sure you keep an eye on the PR, you might need to:

1. Respond to any feedback from reviewers.
2. Make any requested changes by committing to your branch and pushing the updates.

Once your PR is approved, your changes will be merged into the `main` branch and a new release will be initiated, incorporating your updates into the latest version.

Please be patient, as this process can take some time depending on the team’s availability. However, if your changes are critical and you are a client, consider contacting customer support to request priority through a support ticket.

Thanks for contributing 🎉
