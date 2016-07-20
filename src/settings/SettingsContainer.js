import React, { Component } from 'react';
import { connect } from 'react-redux';
import immutableChildrenToJS from 'binary-utils/lib/immutableChildrenToJS';
import SettingsCard from './SettingsCard';
import settingsSelectors from './settingsSelectors';

@connect(settingsSelectors)
export default class SettingsContainer extends Component {

	render() {
		return (
			<SettingsCard {...immutableChildrenToJS(this.props)} />
		);
	}
}
