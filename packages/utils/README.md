# @latticejs/utils
Private set of libraries/functions to be used within @latticejs packages.

## Api
* [`withReadme`](#withReadme)

### `withReadme`

> `function(readme: String) => (function(sections: Array))`
Adds a `Readme` section tab for your Storybook.

Returns another function to be used as storybook HOC that injects some sections (joined) from `readme` passed as argument. See [Usage](#Usage) for more info.

You must include the tags `<!-- start:section_name -->` and `<!-- end:section_name -->` to indicate the start and the end of your readme section to be included.

## Usage

### `withReadme`

To load some sections of your readme:
```jsx
import { withReadme } from '@latticejs/utils';
import Readme from 'path/to/your/README.md';

const loadSections = withReadme(Readme);
const withSomeReadmeSections = loadSections(['api', 'usage']);

export default ({ storiesOf }) => {
  storiesOf('components', module)
    .add(
      'basic',
      withSomeReadmeSections(() => (
        <Basic />
      ))
    );
};

```

To load all the content of Readme:
```jsx
import { withReadme } from '@latticejs/utils';
import Readme from 'path/to/your/README.md';

const withAllReadme = withReadme(Readme);

export default ({ storiesOf }) => {
  storiesOf('components', module)
    .add(
      'basic',
      withAllReadme(() => (
        <Basic />
      ))
    );
};

```
