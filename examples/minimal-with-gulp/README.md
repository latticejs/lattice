# Minimal With Gulp example

![screenshot](screen.png?raw=true "Minimal With Gulp Demo")

### With clap

`clap example minimal-with-gulp myMinimalWithGulpApp`

## How to use

1. Install Gulp globally.

    ```sh
    sudo npm install gulp -g
    ```

2. To check the options to run the project with different environments and configurations run

    ```sh
    gulp --tasks
    ```

### Choices to Run the Server

1. To start the dev server, run
    ```sh
    gulp startServer:dev
    ```

    Load the app in your browser: [http://localhost:3000](http://localhost:3000/).

2. To start the Prod server, run
    ```sh
    gulp startServer:prod
    ```
    Load the app in your browser: [http://localhost:8080](http://localhost:8080/).

3. To start both the servers, run
    ```sh
    gulp startServer
    ```
    Load the app in your browser: For Prod Server [http://localhost:8080](http://localhost:8080/).

    Load the app in your browser: For Dev Server [http://localhost:3000](http://localhost:3000/).


### Choices to run the Unit Test Cases

1. To run the code in testing environment, run
    ```sh
    gulp jest
    ```

2. To run the test environment with code coverage, run
    ```sh
    gulp jest:cc

## Features

- expose webpack and babel config.
- no `react-scripts` usage.

## Idea behind the example

To expose how a Lattice App would look without react-scripts nor other tooling.
The current example is using **webpack** with: css-loader, style-loader, file-loader, html plugin (scripts/styles injection) and webpack-dev-server for development and **Gulp** to execute task. 
**Babel** is also used to transpile the `src` folder, besides the react preset, the babel plugin for handing class properties is being used.
