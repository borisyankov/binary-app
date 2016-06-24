import React, { PropTypes, Component } from 'react';
import epochToDateString from 'binary-utils/lib/epochToDateString';
import M from 'binary-components/lib/M';
import LabeledText from 'binary-components/lib/LabeledText';

export default class SettingsDetails extends Component {

	static propTypes = {
		email: PropTypes.string.isRequired,
		salutation: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		date_of_birth: PropTypes.number,
		country: PropTypes.string.isRequired,
	};

	render() {
		const { email, salutation, first_name, last_name, date_of_birth, country } = this.props;

		return (
			<div className="settings-details">
				<legend>
					<M m="Details" />
				</legend>
				<LabeledText
					id="email"
					label="Email"
					value={email}
				/>
				<LabeledText
					id="name"
					label="Name"
					value={salutation + ' ' + first_name + ' ' + last_name}
				/>
				<LabeledText
					id="dob"
					label="Date of birth"
					value={epochToDateString(date_of_birth)}
				/>
				<LabeledText
					id="residence"
					label="Country of residence"
					value={country}
				/>
				<p className="notice-msg">
					<M m="To change your name, date of birth, country of residence, or email, contact Customer Support." />
				</p>
			</div>
		);
	}
}
