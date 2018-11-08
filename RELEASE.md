# RELEASES & WORKFLOW

> @latticejs

## WORKFLOW

Work is mostly PR-driven. This means every feature, fix, change, delete, etc should go through a pull request process where it will be reviewed. It is important to note that a CHANGELOG update via [chan](https://github.com/geut/chan#usage) **will be required** to express clearly and concisely what brings the current PR.

## Usage example in Lattice

`yarn chan added "New Component: gauge component [PR123](#123) -g latticejs/gauge"`

We are using the `-g package` option to help `chan` organize the changes. In this case, we are saying the new feature belongs to the `gauge package`.

In the end, if everything is ok, it will be merged. :+1: 

## RELEASES

After some time and work a new release will emerge. To do this one can trigger, from the `master` branch, the `yarn run lerna:version` script. This will prompt for the new version, listing changes packages and after confirmation it will `tag` a new release, `commit` the new versions and then it will run a (custom) postversion hook for updating the changelog, `push`ing everything. :rocket:
