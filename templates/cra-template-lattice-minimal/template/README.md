# Minimal example

![screenshot](screen.png?raw=true "Minimal Demo")

## How to use

### With clap

`clap example minimal myMinimalApp`

## Features

- expose webpack and babel config.
- no `react-scripts` usage.

## Idea behind the example

To expose how a Lattice App would look without react-scripts nor other tooling.
The current example is using **webpack** with: css-loader, style-loader, file-loader, html plugin (scripts/styles injection) and webpack-dev-server for development. 
**Babel** is also used to transpile the `src` folder, besides the react preset, the babel plugin for handing class properties is being used.


## To run 

- For Dev: `npm start`

- For Prod: `npm run prod`

- For Tests: `npm run test`
