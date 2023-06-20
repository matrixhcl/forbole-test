## Demo URL

https://matrixhcl.github.io/forbole-test/

## Package used
- Reactjs + typescript + vitejs
- playwright for e2e test
- vitest for unit test

## Setup

### Prerequisite
- yarn 1+ (locally this repository is using yarn 3, but it still needs yarn 1+ to be installed globally)
- nodejs v18+

### Setup on local
1. `yarn install`
2. `yarn dev`
3. Browse `http://localhost:5173/forbole-test/` for local development

## Deployment
When branch is merged to master, github actions will be triggered and automiatcally deploy to this repository's github page.