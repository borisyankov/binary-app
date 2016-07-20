import React, { PropTypes, Component } from 'react';
import P from 'binary-components/lib/P';
import WatchlistItem from './WatchlistItem';

export default class WatchlistCard extends Component {

	static propTypes = {
		watchlistView: PropTypes.object.isRequired,
	};

	render() {
		const { watchlistView } = this.props;

		return (
			<div className="watchlist-card">
				{watchlistView.size === 0 ?
					<P className="notice-msg" text="You have no assets in watchlist" /> :
					watchlistView.map(x =>
					<WatchlistItem
						key={x.get('symbol')}
						item={x}
						onSelect={this.onSelect}
					/>
				)}
			</div>
		);
	}
}
