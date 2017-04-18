import React, { PureComponent } from 'react';
import { Tab, TabList } from 'binary-components';
import { immutableChildrenToJS } from 'binary-utils';
import ExamineAssetFilter from './ExamineAssetFilter';
import AssetDetailsCard from '../asset-details/AssetDetailsCard';
import DailyPricesCard from '../daily-prices/DailyPricesCard';
import DigitStatsCard from '../digit-stats/DigitStatsCard';

export default class ExamineAssetCard extends PureComponent {
    props: {
        details: object,
        digitStats: object,
        dailyPrices: object,
    };

    constructor(props) {
        super(props);
        this.state = { activeTab: 0 };
    }

    onTabChange = idx => this.setState({ activeTab: idx });

    openPicker = () => this.setState({ dropdownShown: true });

    render() {
        const { activeTab } = this.state;
        const { details, digitStats, dailyPrices } = this.props;

        return (
            <div className="examine-asset-card">
                <ExamineAssetFilter />
                <TabList activeIndex={activeTab} onChange={this.onTabChange}>
                    <Tab text="Details" />
                    <Tab text="Digit Stats" />
                    <Tab text="Daily Prices" />
                </TabList>
                {activeTab === 0 &&
                    <AssetDetailsCard {...immutableChildrenToJS(details)} />}
                {activeTab === 1 &&
                    <DigitStatsCard {...immutableChildrenToJS(digitStats)} />}
                {activeTab === 2 &&
                    <DailyPricesCard {...immutableChildrenToJS(dailyPrices)} />}
            </div>
        );
    }
}
