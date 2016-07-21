import React, { PropTypes, PureComponent } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class AnimatedPopup extends PureComponent {

	static propTypes = {
		shown: PropTypes.bool,
		children: PropTypes.any,
	};

	render() {
		const { shown, children } = this.props;

		return (
			<ReactCSSTransitionGroup transitionName="popup" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
				{shown ? children : null}
			</ReactCSSTransitionGroup>
		);
	}
}
