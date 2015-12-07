import React from 'react';
import { Star } from '../_common';

export default class AssetSelectorItem extends React.Component {

	static propTypes = {
		isFavorite: React.PropTypes.bool.isRequired,
		asset: React.PropTypes.object.isRequired,
		onSelect: React.PropTypes.func.isRequired,
		onFavor: React.PropTypes.func.isRequired,
		onUnfavor: React.PropTypes.func.isRequired,
		isSelected: React.PropTypes.bool,
	};

	shouldComponentUpdate(nextProps) {
		return nextProps.isSelected !== this.props.isSelected ||
			nextProps.asset !== this.props.asset ||
			nextProps.isFavorite !== this.props.isFavorite;
	}

	toggleFavorite() {
		const { asset, onFavor, onUnfavor, isFavorite } = this.props;
		const symbol = asset.get('symbol');
		if (isFavorite) {
			onUnfavor(symbol);
		} else {
			onFavor(symbol);
		}
	}

	render() {
		const { asset, onSelect, isFavorite, isSelected } = this.props;
		const focuser = node => {
			if (node !== null && isSelected) {
				node.focus();
			}
		};

		return (
			<tr autoFocus={isSelected} tabIndex={0} ref={focuser} >
				<td>
					<Star on={isFavorite} onClick={::this.toggleFavorite} />
				</td>
				<td onClick={() => onSelect(asset.get('symbol'))}>
					{asset.get('display_name')}
				</td>
				<td className="market-hierarchy" onClick={() => onSelect(asset.get('symbol'))}>
					{asset.get('market_display_name') + ' > ' + asset.get('submarket_display_name')}
				</td>
				<td>
					<span className="info-icon"> i</span>
				</td>
			</tr>
		);
	}
}
