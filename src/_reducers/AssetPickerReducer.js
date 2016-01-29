import { fromJS } from 'immutable';
import {
    SERVER_DATA_ACTIVE_SYMBOLS,
    UPDATE_ASSET_PICKER_SEARCH_QUERY,
    UPDATE_ASSET_PICKER_MARKETS,
    UPDATE_ASSET_PICKER_SUBMARKET,
    SERVER_DATA_ASSET_INDEX,
} from '../_constants/ActionTypes';

const initialState = fromJS({
    query: '',
    markets: [],
    submarket: '',
    shownAssets: [],
    availableAssets: [],
});

export const similarStr = (str1 = '', str2 = '') =>
    str1.toLowerCase().includes(str2.toLowerCase());

const matcher = (asset, query, submarket) =>
    (submarket === '' ||
        submarket === asset.submarket) &&
    (query.trim() === '' ||
        similarStr(asset.symbol, query) ||
        similarStr(asset.display_name, query) ||
        similarStr(asset.market_display_name, query) ||
        similarStr(asset.submarket_display_name, query));

const doFilter = (assetPickerList, query, markets, submarket) =>
    assetPickerList
        .filter(asset => matcher(asset, query, submarket))
        .sort((x1, x2) => x1.display_name.localeCompare(x2.display_name));

const hasTick = assets =>
    assets
        .filter(asset => asset[2].includes('t'))
        .length > 0;

const tickTradeFilter = assetIndex =>
    assetIndex
        .filter(asset => hasTick(asset[2]))
        .map(asset => asset[0]);

export default (state = initialState, action) => {
    switch (action.type) {
        case SERVER_DATA_ACTIVE_SYMBOLS: {
            const activeSymbols = action.serverResponse.active_symbols;
            const filteredSymbols = state.get('tickOnly') ?
                activeSymbols.filter(asset => state.get('tickOnly').indexOf(asset.symbol) > -1) :
                activeSymbols;
            return state
                .set('availableAssets', fromJS(filteredSymbols))
                .set('shownAssets', fromJS(filteredSymbols));
        }
        case UPDATE_ASSET_PICKER_SEARCH_QUERY: {
            const availableAssets = state.get('availableAssets');
            const shownAssets =
                doFilter(availableAssets.toJS(), action.query, state.get('market'), state.get('submarket'));

            return state
                .set('query', action.query)
                .set('shownAssets', shownAssets);
        }
        case UPDATE_ASSET_PICKER_SUBMARKET: {
            const availableAssets = state.get('availableAssets');
            const shownAssets =
                doFilter(availableAssets.toJS(), state.get('query'), state.get('market'), action.submarket);

            return state
                .set('submarket', action.submarket)
                .set('shownAssets', shownAssets);
        }
        case UPDATE_ASSET_PICKER_MARKETS: {
            const availableAssets = state.get('availableAssets');
            const shownAssets =
                doFilter(availableAssets.toJS(), state.get('query'), action.markets, state.get('submarket'));

            return state
                .set('markets', fromJS(action.markets))
                .set('shownAssets', shownAssets);
        }
        case SERVER_DATA_ASSET_INDEX: {
            const symbolWithTick = tickTradeFilter(action.serverResponse.asset_index);
            const shownAssetsWithTick = state.get('availableAssets').filter(asset =>
                symbolWithTick.indexOf(asset.get('symbol')) > -1
            );
            return state
                .set('tickOnly', symbolWithTick)
                .set('shownAssets', shownAssetsWithTick)
                .set('availableAssets', shownAssetsWithTick);
        }
        default:
            return state;
    }
};
