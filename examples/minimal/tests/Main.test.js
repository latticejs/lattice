import { configure } from 'enzyme';
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import App from '../src/App.js';
import React from 'react';

describe('Test Main component', () => {
  configure({ adapter: new Adapter() });
  let shallow;

  beforeAll(() => {
    shallow = createShallow();
  });

  it('shallow test App component', () => {
    shallow(<App />);
  });
});
