import React, { PureComponent } from 'react';
import WatchlistContainer from '../watchlist/WatchlistContainer';
import TradingTimesContainer from '../trading-times/TradingTimesContainer';
import AssetIndexContainer from '../asset-index/AssetIndexContainer';
import NewsContainer from '../news/NewsContainer';
import VideoListContainer from '../video/VideoListContainer';
import PortfolioContainer from '../portfolio/PortfolioContainer';
import StatementContainer from '../statement/StatementContainer';
import ExamineAssetContainer from '../examine-asset/ExamineAssetContainer';
import SettingsContainer from '../settings/SettingsContainer';

const components = [
    PortfolioContainer,
    StatementContainer,
    WatchlistContainer,
    VideoListContainer,
    NewsContainer,
    TradingTimesContainer,
    AssetIndexContainer,
    ExamineAssetContainer,
    SettingsContainer,
];

export default class WorkspaceSidePanel extends PureComponent {
    props: {
        sideActiveTab: number,
        sidePanelSize: number,
        sidePanelVisible: boolean,
    };

    render() {
        const { sideActiveTab, sidePanelSize, sidePanelVisible } = this.props;

        const ActiveComponent = components[sideActiveTab] || components[0];

        if (!sidePanelVisible) return null;

        return (
            <div className="workspace-panel" style={{ width: sidePanelSize }}>
                <ActiveComponent key={sideActiveTab} />
            </div>
        );
    }
}
