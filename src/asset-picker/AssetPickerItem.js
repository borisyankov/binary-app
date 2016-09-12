import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import Star from 'react-material-design-icons/icons/Star';
import StarBorder from 'react-material-design-icons/icons/StarBorder';
import { OpenCloseNotice } from 'binary-components';

export default class AssetPickerItem extends PureComponent {

	static propTypes = {
		asset: PropTypes.object,
		selected: PropTypes.bool,
		onSelect: PropTypes.func,
		onClose: PropTypes.func,
		onToggleWatchlistItem: PropTypes.func,
	};

	static defaultProps = {
		asset: {},
		selected: false,
	};

	onRowClicked = e => {
		const { asset, onClose, onSelect } = this.props;
		onSelect(asset.symbol);
		onClose();
		e.stopPropagation();
	};

	onStarClicked = e => {
		const { asset, onToggleWatchlistItem } = this.props;
		onToggleWatchlistItem(asset);
		e.stopPropagation();
	};

	render() {
		const { asset, selected } = this.props;
		const { isOpen, isInWatchlist } = asset;
		const classes = classnames('asset-picker-item', selected);

		return (
			<tr
				className={classes}
				onClick={this.onRowClicked}
			>
				<td
					onClick={this.onStarClicked}
				>
					{isInWatchlist ? <Star /> : <StarBorder />}
				</td>
				<td>
					{asset.name}
				</td>
				<td style={{ textAlign: 'right' }}>
					<OpenCloseNotice isOpen={isOpen} />
				</td>
			</tr>
		);
	}
}
