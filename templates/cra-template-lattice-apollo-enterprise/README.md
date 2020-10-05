# Enterprise Demo Example CRA Template
> Dashboard create-react-app example using the entire suite of @latticejs components and integrated with the Apollo tools.


![screenshot](screen.png?raw=true "Apollo Enterprise Demo")

## Features

* Graphql server on top of `apollo-yoga` with the permissions middleware `apollo-shield` and `lowdb` as the database.
* Authentication using JWT token
* Local state on top of `apollo-link-state`
* Charts implemented with `@latticejs/mui-recharts`
* CRUD example of employees with an infinite datatable provided by `@latticejs/infinit-list`
* Support for UI themes
* Routing

## How to start

1. Generate the database example (step to do only once)

```bash
$ yarn run graphql:seed
```

2. Start the CRA server in parallel with the apollo server

```bash
$ yarn run dev
```

3. Login as admin:

user: admin@lattice.com
password: 123456


