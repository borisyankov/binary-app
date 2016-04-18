import { createStructuredSelector } from 'reselect';
import { currencySelector, ticksSelector, activeTradeIndexSelector } from '../_store/directSelectors';
import {
    tradesWithDetailsSelector,
    availableContractsSelector,
    assetsIsOpenSelector,
} from '../fulltrade/FullTradeSelectors';

export default createStructuredSelector({
    tradesCount: state => state.workspace.get('tradesCount'),
    layoutN: state => state.workspace.get('layoutN'),
    assetsIsOpen: assetsIsOpenSelector,
    contracts: availableContractsSelector,
    currency: currencySelector,
    trades: tradesWithDetailsSelector,
    ticksForAllSymbols: ticksSelector, // not really!!!
    activeTradeIndex: activeTradeIndexSelector,
});
