import React, { PropTypes, Component } from 'react';
import Tab from 'binary-components/lib/Tab';
import TabList from 'binary-components/lib/TabList';
import SettingsPersonalDetails from './SettingsPersonalDetails';
import SettingsCashier from './SettingsCashier';
import SettingsSelfExclusion from './SettingsSelfExclusion';
import SettingsLimits from './SettingsLimits';
import SettingsChangePassword from './SettingsChangePassword';

const components = [
	SettingsPersonalDetails,
	SettingsChangePassword,
	SettingsCashier,
	SettingsSelfExclusion,
	SettingsLimits,
];

export default class SettingsCard extends Component {

    static propTypes = {
		actions: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
		loginid: PropTypes.string.isRequired,
		boot: PropTypes.object.isRequired,
    };

	constructor(props) {
		super(props);
		this.state = { activeTab: 0 };
	}

	render() {
		const { actions, loginid, settings } = this.props;
		const { activeTab } = this.state;
		const isVirtual = loginid.startsWith('VRTC');
		const ActiveComponent = components[activeTab];

		return (
			<div className="settings-card">
				<TabList
					activeIndex={activeTab}
					onChange={idx => this.setState({ activeTab: idx })}
				>
					<Tab text="Personal" />
					<Tab text="Password" />
					{!isVirtual && <Tab text="Cashier Lock" />}
					{!isVirtual && <Tab text="Self Exclusion" />}
					{!isVirtual && <Tab text="Limits" />}
				</TabList>
				<ActiveComponent actions={actions} {...this.props} {...settings} />
			</div>
		);
	}
}
