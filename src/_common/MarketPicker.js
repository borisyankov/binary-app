import React, { PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

@connect(state => ({ assets: state.assets }))
export default class MarketPicker extends React.Component {

	shouldComponentUpdate = shouldPureComponentUpdate;

	static propTypes = {
		assets: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		showAllOption: PropTypes.bool.isRequired,
		showMarkets: PropTypes.array,
		value: PropTypes.string,
	};

	render() {
		const { assets, onChange, showAllOption, showMarkets, value } = this.props;
		const tree = assets.get('tree').toJS();

		return (
			<select className="market-submarket-picker" onChange={e => onChange(e.target.value)} value={value}>
				{showAllOption ?
					<FormattedMessage id="All" defaultMessage="All">
						{message => <option value="">{message}</option>}
					</FormattedMessage>
				: null}
				{Object
					.keys(tree)
					.filter(market => !showMarkets || ~showMarkets.indexOf(market))
					.map(market => (
					<optgroup key={market} label={tree[market].display_name}>
						{Object.keys(tree[market].submarkets).map(submarket =>
							<option key={submarket} value={submarket}>
								{tree[market]
									.submarkets[submarket]
									.display_name}
							</option>
						)}
					</optgroup>
				))}
			</select>
		);
	}
}
