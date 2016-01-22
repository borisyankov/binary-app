import React, { Component, PropTypes } from 'react';
import { SelectGroup } from '../_common';
import QuickTradeList from './QuickTradeList';

export default class QuickTradeCard extends Component {
    static propTypes = {
        assetSelected: PropTypes.string.isRequired,
        assets: PropTypes.array.isRequired,
        trades: PropTypes.array,
        actions: PropTypes.object.isRequired,
        quickTrade: PropTypes.object.isRequired,
    };

    onAssetChange(e) {
        this.props.actions.updateWorkspaceField('symbolSelected', e.target.value);
        this.props.actions.getTradingOptions(e.target.value);
    }

    render() {
        const { assets, assetSelected, trades } = this.props;
        return (
            <div>
                <SelectGroup
                    options={assets}
                    value={assetSelected}
                    onChange={::this.onAssetChange}
                />
                {trades && <QuickTradeList trades={trades} {...this.props}/>}
            </div>
        );
    }
}
