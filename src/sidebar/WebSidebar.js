import React, { PropTypes, Component } from 'react';
import SidebarBtn from './SidebarBtn';

const switchToAccount = (token, dispatch, actions) => {
	dispatch(actions.removeStatementPersonalData());
	localStorage.setItem('account', JSON.stringify({ token }));
	window.location = '/';
};

export default class WebSidebar extends Component {

	static propTypes = {
		email: PropTypes.string.isRequired,
		loginid: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
		accounts: PropTypes.arrayOf(PropTypes.shape({
			account: PropTypes.string.isRequired,
			token: PropTypes.string.isRequired,
		})),
	};

	render() {
		const { loginid, email, accounts, actions, dispatch } = this.props;

		return (
			<nav className="sidebar">
				<div className="account-info">
					{loginid}<br />
					{email}<br />
				</div>
				{accounts.filter(x => x.account !== loginid).map(x =>
					<a
						key={x.account}
						className="sidebar-btn"
						onClick={() => switchToAccount(x.token, dispatch, actions)}
					>
						<img src="img/icon.png" alt="" />
						<span>Switch to {x.account}</span>
					</a>
				)}
				{/* <SidebarBtn to="/deposit" img="img/profit.svg" text="Deposit" />
				<SidebarBtn to="/settings-mobile" img="img/settings.svg" text="Settings" /> */}
				<SidebarBtn to="/signout" img="img/signout.svg" text="Sign Out" />
			</nav>
		);
	}
}
