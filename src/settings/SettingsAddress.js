import React, { PropTypes, PureComponent } from 'react';
import { Legend, Button, InputGroup, ErrorMsg } from 'binary-components';
import { actions } from '../_store';
import States from './States';
import * as LiveData from '../_data/LiveData';

export default class SettingsAddress extends PureComponent {

	static propTypes = {
		address_line_1: PropTypes.string.isRequired,
		address_line_2: PropTypes.string.isRequired,
		address_city: PropTypes.string.isRequired,
		address_state: PropTypes.string.isRequired,
		country_code: PropTypes.string.isRequired,
		address_postcode: PropTypes.string.isRequired,
		phone: PropTypes.string.isRequired,
		states: PropTypes.array.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			address_line_1: props.address_line_1,
			address_line_2: props.address_line_2,
			address_city: props.address_city,
			address_state: props.address_state,
			address_postcode: props.address_postcode,
			phone: props.phone,
		};
	}

    componentWillMount() {
        const { country_code } = this.props;
        actions.getStatesForCountry(country_code);
    }

	onEntryChange = e =>
		this.setState({ [e.target.id]: e.target.value });

	performUpdateSettings = async () => {
		const { address_line_1, address_line_2, address_city, address_state,
			address_postcode, phone } = this.state;

		try {
			await LiveData.api.setAccountSettings({
				address_line_1,
				address_line_2,
				address_city,
				address_state,
				address_postcode,
				phone,
			});
		} catch (e) {
			this.setState({ errorMessage: e.message });
		}
	}

	onFormSubmit = e => {
		e.preventDefault();
		this.setState({
			validatedOnce: true,
		});
		if (this.allValid) {
			this.performUpdateSettings();
		}
	}

	render() {
		const { states } = this.props;
		const { address_line_1, address_line_2, address_city, address_state,
			address_postcode, country_code, phone, phoneError, serverError } = this.state;

		return (
			<div className="settings-address">
				{serverError &&
					<ErrorMsg text={serverError} />
				}
				<Legend text="Address" />
				<InputGroup
					id="address_line_1"
					type="text"
					label="Address"
					value={address_line_1}
					onChange={this.onEntryChange}
				/>
				{!address_line_1 && <ErrorMsg text="This field is required." />}
				<InputGroup
					id="address_line_2"
					type="text"
					label=" "
					value={address_line_2}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="address_city"
					type="text"
					label="Town/City"
					defaultValue={address_city}
					onChange={this.onEntryChange}
				/>
				<States
					id="address_state"
					country={country_code}
					states={states}
					onChange={this.onEntryChange}
					selected={address_state}
				/>
				<InputGroup
					id="address_postcode"
					type="text"
					label="Postal Code / ZIP"
					defaultValue={address_postcode}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="phone"
					type="tel"
					label="Telephone"
					defaultValue={phone}
					onChange={this.onEntryChange}
				/>
				{phoneError === 'length' && <ErrorMsg text="You should enter between 6-35 characters." />}
				{phoneError === 'allowed' && <ErrorMsg text="Only numbers, space, - are allowed." />}
				<Button
					text="Update"
					onClick={this.tryUpdate}
				/>
			</div>
		);
	}
}
