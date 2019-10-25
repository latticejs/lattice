import { configure } from 'enzyme';
import { createMount } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import App from '../src/App.js';
import Main from '../src/Main.js';

describe('Test Main component', () => {
    configure({ adapter: new Adapter() });
    let mount;
    let childWrapper;

    beforeAll(() => {
        mount = createMount({ untilSelector: 'Main' });
        childWrapper = mount(<Main />);
    });

    it('should render App component', () => {
        expect(childWrapper.find(App)).toHaveLength(1);
    });
});
