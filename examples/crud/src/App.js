import React from 'react';
import Projects from './screens/projects';
import Layout from './components/Layout';

import createStore from './stores';
import { Provider } from 'mobx-react';
import faker from 'faker';

const store = createStore();

for (let i = 0; i < 100; i++) {
  store.projectStore.add({
    id: faker.random.uuid(),
    name: faker.random.words(),
    author: faker.name.findName(),
    active: faker.random.boolean()
  });
}

export default () => (
  <Provider {...store.injectableStores()}>
    <Layout>
      <Projects />
    </Layout>
  </Provider>
);
