# CLAP 

> Create Lattice App

# stack

- commander (parsing input)
- inquirer (autocomplete prompt using gh api)
- async tasks (consider async-gen)
- no transpiling - node v4 compat

## Install

```bash
npm install -g @latticejs/clap
```

:right-arrow: Or you can just use `npx`

## Usage

### Simple

```bash
npx clap myLaticceApp
cd myLaticceApp
npm start
```
This will create a copy of `enterprise-demo` running on `http://localhost:3000`.

## OPTIONS

### custom example

> `--example <example-name>` | `-e <example-name>`

Choose a specific lattice example to bootstrap your project.

### interactive mode

> `--interactive` | `-i`

Navigate lattice examples. A little helper to start your upcoming lattice project.

## API

### listExamples

> `listExamples: function` returns: `Array`

It is used to obtain an array of lattice examples metadata.

## FAQs

