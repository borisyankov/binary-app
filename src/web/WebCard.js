import React, { PropTypes, Component } from 'react';
import WebHeader from './WebHeader';
import Footer from './Footer';
import WorkspaceContainer from '../workspace/WorkspaceContainer';
import RealityCheckContainer from '../reality-check/RealityCheckContainer';

export default class WebCard extends Component {

	static propTypes = {
		actions: PropTypes.object.isRequired,
	};

	render() {
		const { actions } = this.props;

		return (
			<div className="screen">
				<WebHeader actions={actions} />
				<WorkspaceContainer actions={actions} />
				<Footer actions={actions} />
				<RealityCheckContainer actions={actions} />
			</div>
		);
	}
}
