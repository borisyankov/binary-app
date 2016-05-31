import React from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import immutableChildrenToJS from 'binary-utils/lib/immutableChildrenToJS';
import MobilePage from '../containers/MobilePage';
import TradeTypePicker from './TradeTypePicker';
import { mobileTradeTypePickerSelector } from '../trades/singleTradeSelectors';

@connect(mobileTradeTypePickerSelector)
export default class TradeTypePickerMobile extends React.Component {
	static propTypes = {
		actions: React.PropTypes.object.isRequired,
	};

	static contextTypes = {
		router: React.PropTypes.object,
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	onSelectForMobile() {
		const { router } = this.context;
		router.goBack();
	}

	updateParamsForMobile(params) {
		const { actions } = this.props;
		actions.updateMultipleTradeParams(0, params);
		actions.updatePriceProposalSubscription(0);
	}

	clearTradeError() {
		const { actions } = this.props;
		actions.updateTradeError(0, 'barrierError', undefined);
		actions.updateTradeError(0, 'durationError', undefined);
		actions.updateTradeError(0, 'proposalError', undefined);
		actions.updateTradeError(0, 'purchaseError', undefined);
	}

	render() {
		const { actions, contract, params } = immutableChildrenToJS(this.props);
		if (!contract) return null;
		return (
			<MobilePage toolbarShown={false} backBtnBarTitle="Trade Type">
				<TradeTypePicker
					actions={actions}
					contract={contract}
					tradeParams={params}
					onSelect={::this.onSelectForMobile}
					updateParams={::this.updateParamsForMobile}
					clearTradeError={::this.clearTradeError}
				/>
			</MobilePage>
		);
	}
}
