import { trackUserId } from 'binary-utils/lib/Analytics';
import { store } from '../_store/persistentStore';
import { history } from '../_store/root.js';
import { api } from './LiveData';
import { updateAppState, removePersonalData, updateToken, updateBoot } from '../_actions';

export const tryAuth = async token => {
    store.dispatch(updateAppState('authorized', false));
    const response = await api.authorize(token);
    store.dispatch(updateAppState('authorized', true));
    trackUserId(response.authorize.loginid);
};

export const signOut = () => {
    store.dispatch(removePersonalData());
    store.dispatch(updateAppState('authorized', false));
    store.dispatch(updateToken(''));
    history.push('/');
};

export const signIn = () => {
    const oAuthUrl = `https://oauth.binary.com/oauth2/authorize?app_id=${window.BinaryBoot.appId}&l=${window.BinaryBoot.language}`;

    if (window.cordova) {
        const winAuth = window.cordova.InAppBrowser.open(oAuthUrl, '_blank', 'location=no');
        winAuth.addEventListener('loadstart', e => {
            if (e.url.indexOf('acct1') > -1) {
                const accounts = window.BinaryBoot.parseUrl(e.url);
                store.dispatch(updateBoot('accounts', accounts));
                store.dispatch(updateToken(accounts[0].token));
                tryAuth(accounts[0].token);
                winAuth.close();
            }
        });
    } else {
        window.location = oAuthUrl;
    }
};

export const requireAuthOnEnter = (nextState, replace, callback) => {
    const authorized = store.getState().appState.get('authorized');
    const { location } = nextState;
    if (!authorized && location.pathname !== '/') {
        replace({ pathname: '/', state: nextState });
    }
    callback();
};
