# Latticejs CRUD example
This is an example of a common CRUD dashboard, using some **@latticejs** packages, such as `infinite-list` and `widgets`.

## Startup guide
There are two options to get started with this example:
- [Using clap](#using-clap)
- [Clone this repo](clone-this-repo)

### Using `clap` (recommended) 
[Clap](https://github.com/latticejs/lattice/tree/master/packages/clap) is the recommended way to get started with this example. It makes all required steps _automagically_ 🚀:

```bash
clap example crud my-crud-project`
cd my-crud-example
yarn start
```

### Clone this repo
You can copy this example from **@latticejs** repo:
```bash 
git clone git@github.com:latticejs/lattice.git
cd lattice
cp examples/crud /path/to/my-crud-example
cd /path/to/my-crud-example
yarn install
yarn start
```

## Tools

### [Create React App](https://github.com/facebook/create-react-app)
We are using here the CRA tooling to get started. For this example CRA version ^2.0.1 is used.

### [MobX](https://github.com/mobxjs/mobx)
This is a lightweight and faster state management library with a easy interface. This allows us to create a completely observable root store that is composed by sub-stores like: `ui` and several `domain stores`.

There are a lot of other libraries based on MobX but for this example project we try to minimize the overhead, using just the neccesary basic functionality provided by MobX (observable stores/values, computed values, etc).

Thanks to [`mobx-react`](https://github.com/mobxjs/mobx-react) we can inject/observe our store (also other sub-stores) among all the application. This is a good aproach to avoid passing down a lot of props to share the state.

### [Recompose](https://github.com/acdlite/recompose)
This library help us to compose HOCs and add some state/handlers to some of our components.

### [Formik](https://github.com/jaredpalmer/formik)
React based forms. Easy to work with user data input flow.
