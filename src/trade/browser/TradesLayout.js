import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { windowResizeEvent } from 'binary-utils';
import TradeCardContainer from '../TradeCardContainer';
import * as layouts from '../../layouts';
import '../../layouts/layouts.css';

import AllTrades from '../AllTradesSelector';
import AppDepreciatedNotice from '../../app-depreciated-notice/AppDepreciatedNotice';

@connect(AllTrades)
export default class TradesLayouts extends PureComponent {

    props: {
        layoutN: number,
        tradesCount: number,
        trades: any,
    };

    static contextTypes = {
        theme: () => undefined,
    };

    componentDidUpdate() {
        windowResizeEvent();
    }

    render() {
        const { layoutN, tradesCount, trades } = this.props;

        const layout = layouts[`Layout${tradesCount}${layoutN}`];

        if (!layout) return null;

        const tradeComponents = (new Array(tradesCount).fill(0))
            .map((zero, idx) => <TradeCardContainer index={idx} {...trades.get(idx)} />);

        return (<div>
            <AppDepreciatedNotice />
            {layout(tradeComponents, `trades layout-${tradesCount}-${layoutN}`)}
        </div>);
    }
}
