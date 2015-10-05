import React from 'react';
import { MobilePage } from '../common';
import AssetSelectorContainer from './AssetSelectorContainer';

export default (props) => (
	<MobilePage toolbarShown={false}>
		<AssetSelectorContainer {...props} />
	</MobilePage>
);
