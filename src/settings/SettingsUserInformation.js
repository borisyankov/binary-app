import React, { PureComponent } from 'react';
import { Legend, Button, InputGroup, ErrorMsg, ServerErrorMsg, LabeledText, MultiSelectGroup } from 'binary-components';
import States from './States';
import UpdateNotice from '../containers/UpdateNotice';
import * as LiveData from '../_data/LiveData';
import { getConstraints } from './SettingsUserInformation.validation.config';
import ValidationManager from '../_utils/ValidationManager';

export default class SettingsUserInformation extends PureComponent {

	props: {
		settings: any[],
		states: any[],
		residenceList: any[],
	};

	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			formData: {
				address_line_1: props.settings.address_line_1,
				address_line_2: props.settings.address_line_2,
				address_city: props.settings.address_city,
				address_state: props.settings.address_state,
				address_postcode: props.settings.address_postcode,
				phone: props.settings.phone,
				account_opening_reason: props.settings.account_opening_reason,
				tax_residence: props.settings.tax_residence,
				tax_identification_number: props.settings.tax_identification_number
			},
			errors: {},
			hasError: false
		};

		this.constraints = getConstraints(this.props);
    this.validationMan = new ValidationManager(this.constraints);
	}

  onEntryChange = (e: SyntheticEvent) => {
		const s = this.validationMan.validateFieldAndGetNewState(e, this.state.formData);
    this.setState({ ...s, hasError: false });
	}

  onTaxResidenceChange = (val) => {
		const s = this.validationMan.validateAndGetNewState('tax_residence', val, this.state.formData);
		this.setState({ ...s, hasError: false });
	}

	onFormSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		const newErrors = this.validationMan.validateAll(this.state.formData);
		this.setState({ errors: newErrors });
    if (Object.keys(newErrors).length > 0) {
			this.setState({ hasError: true });
		} else {
			this.performUpdateSettings();
		}
	}

	performUpdateSettings = async () => {
		const { formData } = this.state;
		try {
			await LiveData.api.setAccountSettings(formData);
			this.setState({ success: true });
			setTimeout(() => this.setState({ success: false }), 3000);
		} catch (e) {
			this.setState({ serverError: e.error.error.message });
		}
	}

	render() {
		const { states, residenceList } = this.props;
		const { formData, serverError, success, hasError, errors } = this.state;
    const taxResidenceList = residenceList.slice();
    taxResidenceList.filter(props => {
      delete props.disabled;
      return true;
    });

		return (
			<form className="settings-address" onSubmit={this.onFormSubmit}>
				{serverError && <ServerErrorMsg text={serverError} />}
        {hasError && <ErrorMsg text="Please fill the form with valid values" />}
				<UpdateNotice text="Profile updated" show={success} />
				<LabeledText
					id="account_opening_reason"
					label="Account opening reason"
					value={formData.account_opening_reason || ''}
				/>

				<Legend text="Address" />
				<InputGroup
					id="address_line_1"
					type="text"
					label="Address"
					value={formData.address_line_1 || ''}
					onChange={this.onEntryChange}
				/>
				{errors.address_line_1 && <ErrorMsg text={errors.address_line_1[0]} />}
				<InputGroup
					id="address_line_2"
					type="text"
					label=" "
					value={formData.address_line_2 || ''}
					onChange={this.onEntryChange}
				/>
        {errors.address_line_2 && <ErrorMsg text={errors.address_line_2[0]} />}
				<InputGroup
					id="address_city"
					type="text"
					label="Town/City"
					value={formData.address_city || ''}
					onChange={this.onEntryChange}
				/>
        {errors.address_city && <ErrorMsg text={errors.address_city[0]} />}
				<States
					id="address_state"
					country={formData.country_code}
					states={states}
					onChange={this.onEntryChange}
					selected={formData.address_state || ''}
				/>
        {errors.address_state && <ErrorMsg text={errors.address_state[0]} />}
				<InputGroup
					id="address_postcode"
					type="text"
					label="Postal Code / ZIP"
					value={formData.address_postcode || ''}
					onChange={this.onEntryChange}
				/>
        {errors.address_postcode && <ErrorMsg text={errors.address_postcode[0]} />}
				<InputGroup
					id="phone"
					type="tel"
					label="Telephone"
					value={formData.phone || ''}
					onChange={this.onEntryChange}
				/>
        {errors.phone && <ErrorMsg text={errors.phone[0]} />}

				<Legend text="Tax information" />
				<div className="input-row">
					<MultiSelectGroup
						placeholder="Tax residence"
						className="multi-select"
						value={formData.tax_residence || ''}
						options={taxResidenceList}
						joinValues
						multi
						simpleValue
						searchable={false}
						labelKey="text"
						onChange={this.onTaxResidenceChange}
					/>
				</div>
        { errors.tax_residence && <ErrorMsg text={errors.tax_residence[0]} /> }

				<div className="input-row">
					<InputGroup
						id="tax_identification_number"
						value={formData.tax_identification_number || ''}
						label="Tax identification number"
						maxLength="20"
						type="text"
						onChange={this.onEntryChange}
					/>
				</div>
        { errors.tax_identification_number && <ErrorMsg text={errors.tax_identification_number[0]} /> }

				<Button
					text="Update"
					onClick={this.tryUpdate}
				/>
			</form>
		);
	}
}
