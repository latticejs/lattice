import React from 'react';
import Projects from './components/Projects';
import Layout from './components/Layout';

import createStore from './stores';
import { Provider } from 'mobx-react';
import { toJS } from 'mobx';
import faker from 'faker';

const store = createStore();

for (let i = 0; i < 5; i++) {
  store.projectStore.add({
    id: faker.random.uuid(),
    name: faker.random.words(),
    author: faker.name.findName(),
    active: faker.random.boolean()
  });
}

window.store = store;
window.toJS = toJS;

export default () => (
  <Provider {...store.injectableStores()}>
    <Layout>
      <Projects />
    </Layout>
  </Provider>
);
