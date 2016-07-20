import React, { Component } from 'react';
import { connect } from 'react-redux';
import immutableChildrenToJS from 'binary-utils/lib/immutableChildrenToJS';

import AssetPickerCard from './AssetPickerCard';
import assetPickerSelectors from './AssetPickerSelectors';

@connect(assetPickerSelectors)
export default class AssetPickerContainer extends Component {

	render() {
		return (
			<AssetPickerCard {...immutableChildrenToJS(this.props)} />
		);
	}
}
