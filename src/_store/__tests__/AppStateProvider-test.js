import React from 'react';
import configureStore from 'redux-mock-store';
import expect from 'expect';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import AppStateProvider from '../AppStateProvider';

describe('AppStateProvider', () => {
    const middlewares = []; // add your middlewares like `redux-thunk`
    const mockStore = configureStore(middlewares);

    it('should not swallow any error', () => {
        // TODO: find ways to test error
    });

    it('should show loadingview if not connected', () => {
        class ChildComponent extends React.Component {
            render() {
                return <div>Halo</div>;
            }
        }
        const getState = { appState: fromJS({ connected: false }) };
        const store = mockStore(getState, []);
        const wrapper = shallow(
            <AppStateProvider store={store}>
                <ChildComponent/>
            </AppStateProvider>);

        expect(wrapper.render().text()).toContain('check connection');
    });

    it('should show children if connected, whether error or not', () => {
        class ChildComponent extends React.Component {
            render() {
                return <div>Halo</div>;
            }
        }
        const getState = { appState: fromJS({ connected: true }) };
        const store = mockStore(getState, []);
        const wrapper = shallow(
            <AppStateProvider store={store}>
                <ChildComponent/>
            </AppStateProvider>);

        expect(wrapper.render().text()).toExclude('check connection');
    });
});
