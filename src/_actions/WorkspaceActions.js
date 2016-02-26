import * as types from '../_constants/ActionTypes';
import * as LiveData from '../_data/LiveData';

export const changeSelectedAsset = symbol => ({
    type: types.CHANGE_SELECTED_ASSET,
    symbol,
});

export const changeActiveTab = (panel, index) => ({
    type: types.CHANGE_ACTIVE_TAB,
    panel,
    index,
});

export const updateTickTradeSubmarket = submarket => ({
    type: types.UPDATE_TRADING_TIMES_SUBMARKET,
    submarket,
});

export const clearTradeTicks = () => ({
    type: types.CLEAR_TRADE_TICKS,
});

export const selectAssetSymbolForTrade = (newSymbol, oldSymbol) =>
    dispatch => {
        dispatch(clearTradeTicks());
        dispatch(changeSelectedAsset(newSymbol));
        LiveData.api.getTickHistory(newSymbol, { end: 'latest', count: 50 });
        LiveData.api.unsubscribeFromTick(oldSymbol);
        LiveData.api.subscribeToTick(newSymbol);
    };

export const updateWorkspaceField = (fieldName, fieldValue) => ({
    type: types.UPDATE_WORKSPACE_FIELD,
    fieldName,
    fieldValue,
});

export const changeActiveWorkspaceTab = (panel, index) => ({
    type: types.CHANGE_ACTIVE_WORKSPACE_TAB,
    panel,
    index,
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
