# Sonarqube

SonarQube measures and analyzes code quality through [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis). **This feature is enabled by default** in every Store Framework Jamstack (SFJ) project to *guarantee quality and security standards.*

In practice, that means SonarQube analyzes the code of every opened pull request (PR) before allowing it to be merged, preventing bugs and bad practices from going into production.

When an issue is detected, the SonarQube app annotates lines of code on the PR using the analysis's response. There are two types of annotations:

- **Warning:** indicates an improvement point.
- **Failure:** indicates a potential compile error or security vulnerability.

<p align="center">
  <img alt="SonarQube warning" src="https://user-images.githubusercontent.com/18706156/103794175-2c2a9e00-5023-11eb-98bc-cc4b9a3c7b67.png" width="500"/>
</p>
<p align="center">
  <i>Warning due a Typescript non-null assertion.</i>
</p>

<p align="center">
  <img alt="SonarQube failure" src="https://user-images.githubusercontent.com/18706156/103794365-65630e00-5023-11eb-87f1-1ebf6c7e2eea.png" width="500"/>
</p>
<p align="center">
  <i>Failure due an import from an unidentified module.</i>
</p>

## Pull Request checks

The SonarQube app not only notifies the PR's author about the annotations but also adds a check on the pull request with either `success` or `failure`:

<p align="center">
  <img alt="PR checks" src="https://user-images.githubusercontent.com/18706156/103794852-ffc35180-5023-11eb-8fd7-f7a998de5306.png" width="500"/>
</p>

The check will fail if there is **at least one failure annotation**, blocking the PR from merging into the `main` branch.

## Antecipating the rule checkings

SonarQube uses [ESLint](https://eslint.org/) to analyze the source code and come up with the annotations. Since our repositories are configured to use ESLint as a linter, most issues should be easy to spot on the code editor. Make sure to run `yarn` to install the dependencies.

<p align="center">
  <img alt="Warning SonarQube" src="https://user-images.githubusercontent.com/18706156/103795629-fab2d200-5024-11eb-89c4-3d48e820981a.png" width="500"/>
</p>

> Keep in mind that **some SonarQube failures are false negatives**, especially when dealing with modern React/Typescript tooling. We're working to make our analysis free of those failures. 
