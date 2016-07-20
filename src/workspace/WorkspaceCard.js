import React, { PropTypes, Component } from 'react';
import Resizer from 'binary-components/lib/Resizer';
import { actions } from '../_store';
import TradesLayout from '../trade/browser/TradesLayout';
import WorkspaceSidePanel from './WorkspaceSidePanel';
import WorkspaceTabs from './WorkspaceTabs';
import ContractDetailsModal from './ContractDetailsModal';

export default class WorkspaceCard extends Component {

	static propTypes = {
		workspace: PropTypes.object.isRequired,
	};

	onResize = e => {
		actions.changeWorkspacePanelSize('side', window.innerWidth - e.clientX - 92);
	}

	render() {
		const { workspace } = this.props;
		const { sideActiveTab, sidePanelVisible } = workspace;

		return (
			<div className="panels">
				<ContractDetailsModal />
				<TradesLayout />
				<Resizer
					className="resizer-vertical"
					onResize={this.onResize}
				/>
				{sidePanelVisible && <WorkspaceSidePanel {...workspace} />}
				<WorkspaceTabs activeTab={sideActiveTab} />
			</div>
		);
	}
}
