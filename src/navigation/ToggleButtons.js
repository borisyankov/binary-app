import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { workspaceSelector } from '../_selectors/WorkspaceSelectors';

@connect(workspaceSelector)
export default class ToggleButtons extends React.Component {

	static propTypes = {
		leftPanelVisible: PropTypes.bool.isRequired,
		bottomPanelVisible: PropTypes.bool.isRequired,
		rightPanelVisible: PropTypes.bool.isRequired,
		actions: PropTypes.object.isRequired,
	};

	render() {
		const { leftPanelVisible, rightPanelVisible, bottomPanelVisible, actions } = this.props;

		return (
			<div className="toggle-buttons">
				<button
					className={`btn-secondary ${leftPanelVisible && 'checked'}`}
					onClick={() => actions.togglePanel('left')}
				>
					<img src="img/left-panel.svg" />
				</button>
				<button
					className={`btn-secondary ${bottomPanelVisible && 'checked'}`}
					onClick={() => actions.togglePanel('bottom')}
				>
					<img src="img/bottom-panel.svg" />
				</button>
				<button
					className={`btn-secondary ${rightPanelVisible && 'checked'}`}
					onClick={() => actions.togglePanel('right')}
				>
					<img src="img/right-panel.svg" />
				</button>
				<button
					className="btn-secondary"
					onClick={() => actions.toggleTradeMode()}
				>
				</button>
			</div>
		);
	}
}
