import * as types from '../_constants/ActionTypes';
import { createTrade, destroyTrade } from '../_trade/saga/LifeCycleSaga';
import { getTradingOptions } from './TradingOptionsActions';
import { getTicksByCount } from './TickActions';
import { api } from '../_data/LiveData';

export const getDailyPrices = symbol => (dispatch, getState) => {
    const { dailyPrices } = getState();
    if (!dailyPrices.get(symbol)) {
        return api.getCandlesForLastNDays(symbol, 30).catch(err => {
            const errCode = err.error.error.code;
            if (errCode === 'StreamingNotAllowed') {
                return undefined; // swallow error, as nothing we can do
            }
            return Promise.reject(err);
        });
    }
    return Promise.resolve();
};

export const changeExaminedAsset = symbol => dispatch => {
    const tradingOptions = dispatch(getTradingOptions(symbol)); // needed to determine if digit is allowed
    const dailyPrices = dispatch(getDailyPrices(symbol));
    const digitStats = dispatch(getTicksByCount(symbol, 100));
    Promise.all([tradingOptions, dailyPrices, digitStats]).then(() =>
        dispatch({ type: types.CHANGE_INFO_FOR_ASSET, symbol }),
    );
};

export const changeActiveTab = (panel, index) => ({
    type: types.CHANGE_ACTIVE_TAB,
    panel,
    index,
});

export const updateActiveLayout = (tradesCount, layoutN, assetChoices) => ({
    type: types.CHANGE_ACTIVE_LAYOUT,
    tradesCount,
    layoutN,
    assetChoices,
});

export const changeActiveLayout = (tradesCount, layoutN) => (
    dispatch,
    getState,
) => {
    const { assets, tradesParams } = getState();
    const currentTradeCount = tradesParams.size;
    const additionTradeNeeded = tradesCount - currentTradeCount;

    if (additionTradeNeeded < 0) {
        for (let i = 0; i < currentTradeCount - tradesCount; i++) {
            dispatch(destroyTrade(i + tradesCount));
        }
        return dispatch(updateActiveLayout(tradesCount, layoutN));
    }

    if (additionTradeNeeded === 0) {
        return dispatch(updateActiveLayout(tradesCount, layoutN));
    }

    const selectedSymbols = tradesParams.map(v => v.get('symbol'));
    const assetNotSync = assets.size === 0;
    if (assetNotSync) {
        return undefined; // Active symbol call will create trade for us
    }

    const firstOpenSymbol = assets.find(a => a.get('exchange_is_open') === 1);
    const firstTradeSymbol =
        selectedSymbols.get(0) ||
        (firstOpenSymbol
            ? firstOpenSymbol.get('symbol')
            : assets.getIn([0, 'symbol']));

    const firstTradeMarket = assets
        .find(v => v.get('symbol') === firstTradeSymbol)
        .get('market');
    const otherAssetInSameMarket = assets
        .filter(v => {
            const symbolNotSelected = !selectedSymbols.includes(
                v.get('symbol'),
            );
            const sameMarketWithFirst = v.get('market') === firstTradeMarket;
            return symbolNotSelected && sameMarketWithFirst;
        })
        .sort((a, b) => b.get('exchange_is_open') - a.get('exchange_is_open'))
        .map(v => v.get('symbol'));

    if (otherAssetInSameMarket.size < additionTradeNeeded) {
        // get assets not found in otherAssetInSameMarket
        const randomAdditionalSymbols = assets
            .filter(v =>
                otherAssetInSameMarket.find(a => a !== v.get('symbol')),
            )
            .take(additionTradeNeeded - otherAssetInSameMarket.size);
        const combinedAssetChoices = otherAssetInSameMarket.concat(
            randomAdditionalSymbols,
        );
        const assetToBeUsedForNewTrades = combinedAssetChoices.take(
            additionTradeNeeded,
        );

        dispatch(
            updateActiveLayout(
                tradesCount,
                layoutN,
                assetToBeUsedForNewTrades.toJS(),
            ),
        );
        return assetToBeUsedForNewTrades.forEach((asset, idx) =>
            dispatch(createTrade(idx + currentTradeCount, asset)),
        );
    }
    const assetToBeUsedForNewTrades = otherAssetInSameMarket.take(
        additionTradeNeeded,
    );

    dispatch(
        updateActiveLayout(
            tradesCount,
            layoutN,
            assetToBeUsedForNewTrades.toJS(),
        ),
    );
    return assetToBeUsedForNewTrades.forEach((asset, idx) =>
        dispatch(createTrade(idx + currentTradeCount, asset)),
    );
};

export const changeActiveWorkspaceTab = (panel, index) => ({
    type: types.CHANGE_ACTIVE_WORKSPACE_TAB,
    panel,
    index,
});

export const changeActiveTrade = activeTradeIndex => ({
    type: types.CHANGE_ACTIVE_TRADE,
    activeTradeIndex,
});

export const changeWorkspacePanelSize = (panel, size) => ({
    type: types.CHANGE_WORKSPACE_PANEL_SIZE,
    panel,
    size,
});

export const changeTradeMode = tradeMode => ({
    type: types.CHANGE_TRADE_MODE,
    tradeMode,
});

export const toggleTradeMode = () => ({
    type: types.TOGGLE_TRADE_MODE,
});

export const togglePanel = panel => ({
    type: types.TOGGLE_PANEL,
    panel,
});
