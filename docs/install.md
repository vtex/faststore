# Installation

Some internal packages are private and require authentication before they can be installed. This document explains the steps needed to get everything set up.

## 1. Authenticate on AWS CodeArtifact

[Internal Document](https://docs.google.com/document/d/1wjTz0M2nrPTISgXJ3xKpOtk0J-NTuA3u9rcVwhirb4Y/edit?usp=sharing) on how to authenticate using CodeArtifact.

## 2. Install dependencies

Now that you are authenticated, run `pnpm install` from the root directory and pnpm will install all packages without errors.

---

## AWS CLI INSTALLATION

### macOS

```bash
brew update && brew upgrade && brew install awscli
```
