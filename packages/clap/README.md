# CLAP 

> Create Lattice App

## Install

:warning: *Lattice is currently being released using the `beta` channel. This means you should consider adding the `@beta` tag to point to the latest versions when installing.*

```bash
npm install -g @latticejs/clap@beta
```

## Usage

```bash
$ clap myLaticceApp
cd myLaticceApp
npm start
```
This will create a copy of `basic` running on `http://localhost:3000`.

## Commands 

### example

> `example [options] <example-name>` | `e [options] <example-name>`

Choose a specific [lattice example](/examples) to bootstrap your project.

Eg:

`$ clap example basic myDemo`

#### Options

##### `-b <branch_name>, --branch=<branch_name>`
Set a branch from latticejs repo. This option will try to download the example from branch_name. See https://github.com/latticejs/lattice/branches.

Eg:

`$ clap example -b feature/add-new-example new-example myDemo`


### list 

> `list` | `ls`

List all the available lattice examples.

Eg:

`$ clap ls`

#### Options

##### `-b <branch_name>, --branch=<branch_name>`
Lists all examples from @latticejs branch_name. See https://github.com/latticejs/lattice/branches.

Eg:

`$ clap ls -b feature/other-example`

## FAQs

