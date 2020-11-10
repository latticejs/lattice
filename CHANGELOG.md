# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- [examples] use named imports
- [examples] normalize start scripts

### Fixed
- [lattice-scripts] remove console.log call from lattice-script build step.
- [examples] dag-in-action height grows indefinitely on FF.
- [packages] index.js files are fixed.

### Removed
- react-scripts package.

## Reinforcement
- Upgrade the version of Widget and MUI-Recharts packages to Beta-1.0.3

## Addition Phase - 2019-12-04
- Added Map Package.
- Added ag-grid package.
- Added Example of Mapbox, Sunburst && PieChart.
- Readmes are updated

## Update MUI version
- Updated MUI version in dag package to 4.5.1.
- Gauge Package
- Mui-Recharts Package
- Infinte-List Package
- Tree
- Widgets
- Dag-in-Action Example
- Lattice-SSR Example
- Fixed greenkeeper bugs.

## Update Phase - 2019-10-18
- Updated minimal example with jest and lint configurations.
- Upgraded MUI version in Minimal Example.
- Upgraded MUI version in ARTC Example.

## [1.0.1-beta.3] - 2019-12-27
- Versions of Ag-Grid and Map is updated to 1.0.1-beta.4.
- Clap deprecated functions are now updated.

## [1.0.1-beta.2] - 2019-09-11
- Package Dependency is updated.(#310)
- Fixed Green Keeper issue.
- Integrated Gulp in Minimal Example.
- Updated MUI Version in Basic and CRUD Example.
- Added the Froala Editor.

## [1.0.1-beta.1] (Resumption Phase) - 2019-09-04
- Resuming and completing gauge component.
- Adding the Lattice-SSR example.

## [1.0.1-beta.1] - 2018-11-13 [YANKED]

## 1.0.1-beta.0 - 2018-11-08
### Added
- tasks for conditional releasing from travis.

### Changed
- examples/minimal
  - examples: update minimal example to babel 7 (#263)
- examples/minimal-with-gulp
  - examples: added froala-editor in minimal-with-gulp example

### Fixed
- examples/dag-in-action
  - examples: fix dag example (#261)
- examples/minimal
  - examples: add div for widgets children (#262)

  ## Update Phase - 2020-08-24
- Versions of mui-recharts and widget is updated from 1.0.1-beta.2 to 1.0.1-beta.3.
- examples: fix console warnings

## Update Phase - 2020-08-28
- Greenkeeper: Versions of packages has been upgraded to fix greenkeeper issues.

## Update Phase - 2020-09-03
Following examples are now upgraded to use Hooks.
  - upgrade apollo-enterpris.
  - apollo-real-time-chart
  - basic
  - lattice-ssr
  - minimal
  - minimal-with-gulp
  - rechart-grid-map
  - crud

## Update Phase - 2020-08-31
- Greenkeeper: Versions of packages has been upgraded to fix greenkeeper PR issues.

## Update Phase - 2020-09-11
- packages
  - clap: upgrade @octokit/rest to 18.0.5.

## Update Phase - 2020-09-23
- packages
  - clap: Fixed clap terminal warnings. Also Upgraded the version of clap package to 1.0.1-beta.11
  - clap: Added shebang line in cli.js.

### Fixed
- examples/basic
  - examples: fix basic example

### Development Phase - 2020-10-01
CRA Templates has been created for following examples.
  - basic
  - crud
  - dag-in-action
  - rechart-grid-map
  - minimal
  - minimal-with-gulp
  - apollo-enterprise
  - apollo-real-time-chart
  - lattice-ssr

### Addition Phase - 2020-10-14
Image.png file has been added in CRA Templates for following examples.
  - basic
  - crud
  - dag-in-action
  - rechart-grid-map
  - minimal
  - minimal-with-gulp
  - apollo-enterprise
  - apollo-real-time-chart
  - lattice-ssr

### Fixed - 2020-10-01
- examples/apollo-real-time-chart
- examples/lattice-ssr
- examples: fix apollo-real-time-chart example
- examples: CLAP myapp bug and version is fixed


## Addition Phase - 2020-10-08
- Added saas-starter example with complete ReadMe.
- Moved the content of the client folder of SAAS-Starter in the root and .env file is added.
- Added templates

Following packages Storybook are now upgraded from version 5 to 6.
- Map
- Tree
- Froala-Editor

[unreleased]: https://github.com/:latticejs/lattice/compare/v1.0.1-beta.1...HEAD
[1.0.1-beta.1]: https://github.com/:latticejs/lattice/compare/v1.0.1-beta.0...v1.0.1-beta.1
