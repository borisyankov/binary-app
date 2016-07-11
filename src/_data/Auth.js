import { store } from '../_store/persistentStore';
import * as LiveData from './LiveData';
import { signinFieldUpdate, updateAppState, removePersonalData, updateToken } from '../_actions';
import { trackUserId } from 'binary-utils/lib/Analytics';
// import showError from 'binary-utils/lib/showError';

export const tryAuth = async (actions, token) => {
    if (!token) {
        actions.signinFieldUpdate('progress', false);
        actions.signinFieldUpdate('tokenNotEntered', true);
    }

    actions.updateAppState('authorized', false);

    try {
        const response = await LiveData.api.authorize(token);
        actions.signinFieldUpdate('credentialsInvalid', false);
        trackUserId(response.authorize.loginid);
    } catch (e) {
        actions.signinFieldUpdate('credentialsInvalid', true);
    } finally {
        actions.signinFieldUpdate('progress', false);
    }
};

export const signOut = () => {
    store.dispatch(removePersonalData());
    store.dispatch(signinFieldUpdate('validatedOnce', false));
    store.dispatch(updateAppState('authorized', false));
    store.dispatch(updateToken(''));
};

export const signIn = () => {
    const oAuthUrl = `https://oauth.binary.com/oauth2/authorize?app_id=${window.BinaryBoot.appId}`;

    if (window.cordova) {
        const link = (window.device.platform.toLowerCase() === 'ios' ? encodeURIComponent(oAuthUrl) : oAuthUrl);
        const winAuth = window.cordova.InAppBrowser.open(link, '_blank', 'location=no');
        winAuth.addEventListener('loadstop', (e) => {
            if (e.url.indexOf('acct1') > -1) {
                winAuth.close();
                window.BinaryBoot.parseUrl(e.url);
                window.location.reload();
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
