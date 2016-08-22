import React, { PropTypes, PureComponent } from 'react';
import { dateToDateString, todayLocaleString, oneYearAfterStr } from 'binary-utils';
import { actions } from '../_store';
import MarketSubmarketPickerContainer from '../asset-picker/MarketSubmarketPickerContainer';
import TradingTimesTable from './TradingTimesTable';

export default class TradingTimesCard extends PureComponent {

	static propTypes = {
		assets: PropTypes.array.isRequired,
		tradingTimes: PropTypes.array.isRequired,
		tradingTimesFilter: PropTypes.object.isRequired,
	};

	assetMatchFilter = (symbolName, filter) => {
		const { assets } = this.props;
		const assetObj = assets.find(x => x.symbol === symbolName);
		const returnObj = assetObj ? (assetObj.market === filter || assetObj.submarket === filter) : null;
		return returnObj;
	}

	updateTradingTimes = e => {
		const inputVal = e.target.value;
		if (/\d{4}-\d{1,2}-\d{1,2}/.test(inputVal) && inputVal.slice(0, 4) >= 1000) {
			actions.updateTradingTimesDate(inputVal);
		}
	}

	render() {
		const { tradingTimes, tradingTimesFilter } = this.props;
		const filter = tradingTimesFilter.filter;
		const tradingTimesDate = tradingTimesFilter.date;

		return (
			<div className="trading-times-card">
				<div className="trading-times-filter">
					<MarketSubmarketPickerContainer
						onChange={x => actions.updateTradingTimesFilter(x)}
						allOptionShown={false}
						value={filter}
					/>
					<input
						type="date"
						defaultValue={dateToDateString(tradingTimesDate)}
						min={todayLocaleString()}
						max={oneYearAfterStr()}
						className="trading-times-date-picker"
						onChange={this.updateTradingTimes}
						maxLength={10}
					/>
				</div>
				<TradingTimesTable
					{...this.props}
					key={filter}
					times={tradingTimes.filter(a => this.assetMatchFilter(a.symbol, filter))}
				/>
			</div>
		);
	}
}
