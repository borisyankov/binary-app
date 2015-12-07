import { LiveApi } from 'binary-live-api';
import { readNewsFeed } from './NewsData';
import { getVideosFromPlayList } from './VideoData';
import * as actions from '../_actions';

const handlers = {
    'authorize': 'serverDataAuthorize',
    'balance': 'serverDataBalance',
    'active_symbols': 'serverDataActiveSymbols',
    'trading_times': 'serverDataTradingTimes',
    'asset_index': 'serverDataAssetIndex',
    'portfolio': 'serverDataPortfolio',
    'statement': 'serverDataStatement',
    'tick': 'serverDataTickStream',
    'history': 'serverDataTickHistory',
    'proposal_open_contract': 'serverDataProposalOpenContract',
    'payout_currencies': 'serverDataPayoutCurrencies',
    'profit_table': 'serverDataProfitTable',
    'proposal': 'serverDataProposal',
    'buy': 'serverDataBuy',
    'get_limits': 'serverDataAccountLimits',
    'get_self_exclusion': 'serverDataAccountSelfExclusion',
    'get_settings': 'serverDataAccountSettings',
    'news': 'updateNewsList',
    'videos': 'updateVideoList',
};

export const api = new LiveApi({ language: 'EN' });

const subscribeToSelectedSymbol = st => {
    const selectedSymbol = st.getState().workspace.get('symbolSelected');
    api.subscribeToTick(selectedSymbol);
};

const subscribeToWatchlist = st => {
    const newState = st.getState();
    if (!newState.workspace) {
        return;
    }
    const favs = newState.workspace.get('favoriteAssets');
    api.subscribeToTicks(favs);
};

export const initUnauthorized = store => {
    api.getActiveSymbolsFull();
    api.getTradingTimes();
    api.getAssetIndex();
    api.getActiveSymbolsFull();

    readNewsFeed().then(articles => api.events.emit('news', articles));
    getVideosFromPlayList().then(videos => api.events.emit('videos', videos));
    subscribeToSelectedSymbol(store);
};

export const initAuthorized = (authData, store) => {
    api.getPortfolio();
    api.getStatement({ description: 1, limit: 20 });
    api.getProfitTable({ description: 1, limit: 20 });
    api.getAccountSettings();
    api.getPayoutCurrencies();
    api.subscribeToBalance();           // some call might fail due to backend overload
    api.subscribeToAllOpenContracts();
    subscribeToWatchlist(store);

    const isVirtual = authData.authorize.loginid.startsWith('VRTC');
    if (!isVirtual) {
        api.getAccountLimits();
        api.getSelfExclusion();
    }
};

export const trackSymbols = symbols => {
    api.unsubscribeFromAllTicks();
    api.subscribeToTicks(symbols);
};

export const connect = store => {
    const ln = store.getState().signin.get('language');
    api.changeLanguage(ln);

    Object.keys(handlers).forEach(key => {
        const action = actions[handlers[key]];

        api.events.on(key, (data) => store.dispatch(action(data)));
        api.events.on(key, () => window.console.log);
    });

    initUnauthorized(store);

    api.events.on('authorize', response => initAuthorized(response, store));
};
