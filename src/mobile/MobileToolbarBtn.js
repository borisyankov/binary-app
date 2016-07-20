import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class MobileToolbarBtn extends Component {

	static propTypes = {
		to: PropTypes.string.isRequired,
		img: PropTypes.string.isRequired,
	};

	render() {
		const { to, img } = this.props;

		return (
			<Link
				to={to}
				activeClassName="active"
				className="mobile-nav-btn"
			>
				<img src={img} alt="Menu" />
			</Link>
		);
	}
}
