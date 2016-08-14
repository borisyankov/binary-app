import { Map } from 'immutable';
import { windowResizeEvent } from 'binary-utils';

import {
    CHANGE_INFO_FOR_ASSET,
    CHANGE_ACTIVE_TRADE,
    WORKSPACE_FAVOR_ASSET,
    WORKSPACE_UNFAVOR_ASSET,
    CHANGE_ACTIVE_TAB,
    UPDATE_WORKSPACE_FIELD,
    CHANGE_ACTIVE_LAYOUT,
    CHANGE_ACTIVE_WORKSPACE_TAB,
    CHANGE_WORKSPACE_PANEL_SIZE,
    TOGGLE_TRADE_MODE,
    CHANGE_TRADE_MODE,
    TOGGLE_PANEL,
    REMOVE_TRADE,
} from '../_constants/ActionTypes';

const initialState = new Map({
    tradesCount: 1,
    layoutN: 1,
    sidePanelVisible: true,
    sidePanelSize: 320,
    sideActiveTab: 0,
    tradeMode: 'tabs',
    activeTradeIndex: 0,
});

export default (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_ACTIVE_TAB: {
            return state.set(action.panel + 'ActiveTab', action.index);
        }
        case CHANGE_INFO_FOR_ASSET: {
            return state.set('examinedAsset', action.symbol);
        }
        case CHANGE_ACTIVE_TRADE: {
            return state.set('activeTradeIndex', action.activeTradeIndex);
        }
        case WORKSPACE_FAVOR_ASSET: {
            return state.update('favoriteAssets', x => x.add(action.symbol));
        }
        case WORKSPACE_UNFAVOR_ASSET: {
            return state.update('favoriteAssets', x => x.delete(action.symbol));
        }
        case UPDATE_WORKSPACE_FIELD: {
            return state.set(action.fieldName, action.fieldValue);
        }
        case CHANGE_ACTIVE_LAYOUT: {
            return state
                .set('tradesCount', action.tradesCount)
                .set('layoutN', action.layoutN);
        }
        case CHANGE_ACTIVE_WORKSPACE_TAB: {
            windowResizeEvent();
            const panelVisible = state.get(action.panel + 'PanelVisible');
            const sameTabSelected = state.get(action.panel + 'ActiveTab') === action.index;
            return state
                .set(action.panel + 'ActiveTab', action.index)
                .set(action.panel + 'PanelVisible', !(panelVisible && sameTabSelected));
        }
        case CHANGE_WORKSPACE_PANEL_SIZE: {
            windowResizeEvent();
            return state
                .set(action.panel + 'PanelSize', action.size > 150 ? action.size : 150)
                .set(action.panel + 'PanelVisible', action.size > 150);
        }
        case TOGGLE_TRADE_MODE: {
            const tradeModes = ['tabs', 'grid', 'jp'];
            const currentMode = tradeModes.indexOf(state.get('tradeMode'));
            const newTradeModeIdx = currentMode >= tradeModes.length - 1 ? 0 : currentMode + 1;
            return state.set('tradeMode', tradeModes[newTradeModeIdx]);
        }
        case CHANGE_TRADE_MODE: {
            return state.set('tradeMode', action.tradeMode);
        }
        case TOGGLE_PANEL: {
            windowResizeEvent();
            const panelField = action.panel + 'PanelVisible';
            return state.set(panelField, !state.get(panelField));
        }
        case REMOVE_TRADE: {
            const activeIdx = state.get('activeTradeIndex');
            const newActIdx = activeIdx > 0 ? activeIdx - 1 : 0;

            return state.set('activeTradeIndex', newActIdx);
        }
        default:
            return state;
    }
};
