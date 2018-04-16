# Contribute to Lattice

Hi! First of all, thanks for taking some time to make a contribution to the project. Below you will find all the basic information to get started.

# Table of Contents

- [Setting Up a Local Copy](#setting-up-a-local-copy)
- [Customized React Scripts](#customized-react-scripts)
- [Development](#development)
- [How To Consume a Local Package](#how-to-consume-a-local-package)

## Setting Up a Local Copy

1. Clone the repo with `git clone https://github.com/latticejs/lattice`.

2. If is not already present, install yarn globally `npm i -g yarn`.

3. Run `yarn` in the root `lattice` folder.

4. Finally, run `yarn run learn prepublish` in order to trigger npm install lifecycle ([see more](https://github.com/yarnpkg/yarn/issues/3911))

Once it is done, you can modify any file locally and run `yarn start`, `yarn test` or `yarn build` just like in a generated project.

## Customized React Scripts 

If you want to try out the `@lattice/react-scripts` locally, you can run this command on the root `lattice` folder:

```
yarn create-react-app test-app
cd test-app
```

and then run `yarn start` or `yarn build`.

## Development

1. Run `npx create-react-app test-demo-app` outside project's workspace.

2. Remove `node_modules` directory from the recently created react app `test-demo-app`

3. Move `test-demo-app` inside `lattice/packages` directory.

4. Run `yarn` in the root `lattice` folder.

5. Finally, `cd test-demo-app && yarn start`.

## How to consume a local package

1. For example, inside `test-demo-app` directory you can run `npx lerna add @lattice/target-module --scope=test-demo-app`

> *scope* should be the name defined in local package.json.

2. If target module has peer dependencies, those should be installed as mentioned in *1*.

Now modules are linked and local changes can be seen instantly.
