# Contribute to Lattice

Hi! First of all, thanks for taking some time to make a contribution to the project. Below you will find all the basic information to get started.

# Table of Contents

- [Setting Up a Local Copy](#setting-up-a-local-copy)
- [Customized React Scripts](#customized-react-scripts)
- [Development](#development)
- [Working in a specific latticejs module](#working-in-a-specific-latticejs-module)
- [How to run a demo app](#how-to-run-a-demo-app)
- [How To Consume a Local Package](#how-to-consume-a-local-package)
- [Troubleshooting](#troubleshooting)
- [Cleaning the project](#cleaning-the-project)

## Setting Up a Local Copy

1. Clone the repo with `git clone https://github.com/latticejs/lattice`.

2. If is not already present, install yarn globally `npm i -g yarn`.

3. Run `yarn` in the root `lattice` folder.

4. Finally, run `yarn run lerna run prepublish` in order to trigger npm install lifecycle ([see more](https://github.com/yarnpkg/yarn/issues/3911))

Once it is done, you can modify any file locally and run `yarn start`, `yarn test` or `yarn build` just like in a generated project.

## Running our Customized React Scripts

If you want to try out the `@latticejs/react-scripts` locally, you can run this command on the root `lattice` folder:

```
yarn run create-react-app test-demo-app
cd test-demo-app
```

and then run `yarn start` or `yarn build`.

## Development

### Creating Lattice packages

#### Readme
New packages must have a `README.md` file with at least the next main sections:

* Package **name** and **description**.
* **Install**: How to install this package.
* **Usage**: How to import/run/use this package.
    * **Example**: Brief example (some code) showing the basics of your package.
    * **API**: Package settings, methods and configuration.
* **FAQs** If any. Some troubleshooting is welcome.

#### Storybook
If your package includes some component, you can include a [Storybook](https://github.com/storybooks/storybook) to show different usage ways (based on state, props, settings) of the component.

##### Install 
If you not have (globally) installed storybook already: 
```bash
$ yarn global add @storybook/cli
```

##### Usage
Run the following command in your project root to get started with storybook.
```bash
$ getstorybook
```

Example:
```bash 
$ cd /path/to/my-package && getstorybook
```

Here is a [basic slow start](https://storybook.js.org/basics/slow-start-guide/) with some help.

##### Addons 
Storybook comes with a set of [Addons](https://storybook.js.org/addons/introduction/) wich can be very usefull to enhance your components stories. 

Some of them:
* [Actions](https://github.com/storybooks/storybook/tree/release/3.4/addons/actions): Log and inspect events of your component.
* [Readme](https://github.com/tuchk4/storybook-readme): Adds a readme section.
* [Notes](https://github.com/storybooks/storybook/tree/release/3.4/addons/notes): Notes tab with support for HTML.

Check out the [Addons full list](https://storybook.js.org/addons/addon-gallery/). 

#### Tests
**Include tests for your package**. 

1. Create a `test/` folder into your package with all your tests files.
2. Add a `test` npm script in your `package.json` file.

Example:

`package.json`
```diff
    ...
    "scripts": {
-        "start": "node index.js"
+        "start": "node index.js",
+        "test": "jest"
    },
    ...
```

We are currently using two main testing tools (can be used together if needed):

* [Enzyme](http://airbnb.io/enzyme/): (only for React) Test tool for components output.
* [Jest](https://jestjs.io/): Testing toolset. It can be used even to test non-web packages or libraries.


### Working in a specific latticejs module

1. Run `cd pacakges/<module>`
2. Development using storybook: `yarn storybook`

### How to run a demo app

1. Run `npx create-react-app test-demo-app` outside project's workspace.

2. Remove `node_modules` directory from the recently created react app `test-demo-app`

3. Move `test-demo-app` inside `lattice/packages` directory.

4. Run `yarn` in the root `lattice` folder.

5. Finally, `cd test-demo-app && yarn start`.

### How to consume a local package

1. For example, inside `test-demo-app` directory you can run `npx lerna add @lattice/target-module --scope=test-demo-app`

> *scope* should be the name defined in local package.json.

2. If target module has peer dependencies, those should be installed as mentioned in *1*.

Now modules are linked and local changes can be seen instantly.

## Troubleshooting

### Cleaning the project

Sometimes, after a major change in the source is preferable start with a new clean repository: `git clean -xdf`

> Remember that you are going to lose your unversioned files.
