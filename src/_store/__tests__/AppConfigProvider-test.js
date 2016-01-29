import React from 'react';
import configureStore from 'redux-mock-store';
import expect from 'expect';
import { fromJS } from 'immutable';
import { shallow, render } from 'enzyme';
import AppConfigProvider from '../AppConfigProvider';
import { IntlProvider } from 'react-intl';

describe('AppConfigProvider', () => {
    class ChildComponent extends React.Component {
        render() {
            return <div className="halo">World</div>;
        }
    }
    const middlewares = []; // add your middlewares like `redux-thunk`
    const mockStore = configureStore(middlewares);
    const getState = { appConfig: fromJS({ theme: 'dark', language: 'EN' }) };
    const store = mockStore(getState, []);

    it('should render children', () => {
        const wrapper = shallow(
            <AppConfigProvider store={store}>
                <ChildComponent/>
            </AppConfigProvider>);

        expect(wrapper.render().text()).toContain('World');
    });

    it('should render theme-wrapper', () => {
        const wrapper = render(
            <AppConfigProvider store={store}>
                <ChildComponent/>
            </AppConfigProvider>);
        expect(wrapper.find('#theme-wrapper').hasClass('inverse')).toEqual(true);
    });
});
