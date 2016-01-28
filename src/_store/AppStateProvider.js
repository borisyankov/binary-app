import React, { Children, Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LoadingView from '../loading-view/LoadingView';
import { appStateSelector } from '../_selectors/AppStateSelectors';
/**
 * Note: The loading view is tightly coupled with the auto-signin flow of apps,
 * If we render children before connected === true, auto sign-in will fail
 */
@connect(appStateSelector)
export default class AppStateProvider extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        connected: PropTypes.bool.isRequired,
    };

    render() {
        const { connected, children } = this.props;
        let result;
        if (connected) {
            result = children;
        } else {
            result = <LoadingView text="Taking too long to load, check connection" />;
        }

        return Children.only(result);
    }
}
