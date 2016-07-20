import React, { Component } from 'react';
import { connect } from 'react-redux';
import immutableChildrenToJS from 'binary-utils/lib/immutableChildrenToJS';
import BalanceCard from './BalanceCard';
import balanceSelectors from './balanceSelectors';

@connect(balanceSelectors)
export default class Balance extends Component {

	render() {
		return (
			<BalanceCard {...immutableChildrenToJS(this.props)} />
		);
	}
}
