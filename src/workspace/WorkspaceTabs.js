import React, { PureComponent } from 'react';
import { Tab, TabList } from 'binary-components';
import { actions } from '../_store';

export default class WorkspaceTabs extends PureComponent {
    props: {
        activeTab: number,
    };

    onTabChange = (idx: number) => {
        actions.changeActiveWorkspaceTab('side', idx);
    };

    render() {
        const { activeTab } = this.props;

        return (
            <TabList
                id="right-tab-list"
                className="inverse"
                vertical
                activeIndex={activeTab}
                showText
                onChange={this.onTabChange}
            >
                <Tab imgSrc="img/portfolio.svg" text="Portfolio" />
                <Tab imgSrc="img/statement.svg" text="Statement" />
                <Tab imgSrc="img/watchlist.svg" text="Watchlist" />
                <Tab imgSrc="img/video.svg" text="Video" />
                <Tab imgSrc="img/news.svg" text="News" />
                <Tab imgSrc="img/time.svg" text="Trading Times" />
                <Tab imgSrc="img/resources.svg" text="Asset Index" />
                <Tab imgSrc="img/info.svg" text="Details" />
                <Tab imgSrc="img/settings.svg" text="Settings" />
            </TabList>
        );
    }
}
