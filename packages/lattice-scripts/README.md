# Lattice scripts

> Scripts for work with @latticejs packages.

## Install

:warning: *Lattice is currently being released using the `alpha` channel. This means you should consider adding the `@alpha` tag to point to the latest versions when installing.*

```bash
yarn add @latticejs/lattice-scripts
```

## Commands

### build

> `build [options] <input>`

Build your source files into cjs, esm and umd formats.

Eg:

`$ lattice-scripts build ./src/index.js`

This command takes your `package.json` file to extract some  properties:

* `name`: (Required) For generated (non code splitted) bundles.
* `browser`: Name for `umd` generated bundle (*).
* `main`: Name for `cjs` generated bundle (*).
* `module`: Name for `esm` generated bundle (*).

* If not present, default value is: `./<config.outputFolder>/<umd|cjs|esm>/index.js`,

#### Options

##### `-f <formats>, --formats=<formats>`
Comma separated export formats: (available: `umd`|`cjs`|`esm`). Default: `cjs,esm,umd`.

Eg:

`$ lattice-scripts build -f cjs,esm ./src/index.js`

Will generate a commonJS and a ESModule bundle.

##### `-e <environment>, --env=<environment>`
Environment to be used. Default: `production`.

If `env = production` no sourcemap is generated and bundle output is minified.
If `env = development` sourcemap is generated and bundle output is not minified.

Eg:

`$ lattice-scripts build -e development ./src/index.js`

Will generate sourcemaps for each format.


## Configuration
Lattice scripts can be configured using a `lattice-scripts.config.js` file.
It must export an object with an entry by command eg: ` { build: {...} }`.
As example: This is the current supported configuration:

```javascript
module.exports = {
  build: {
    codeSplitting: [],
    outputFolder: 'dist'
  }
};
```

### `build`
Config for `build` command.

#### `codeSplitting: Array`
Array of extra input files.

Example:
```javascript
module.exports = {
  build: {
    codeSplitting: ['./src/module-one', './src/module-two', './src/module-three']
  }
};
```

#### `outputFolder: String`
Folder for generated files. Default: `dist`.

Example:
```javascript
module.exports = {
  build: {
    outputFolder: 'output'
  }
};
```