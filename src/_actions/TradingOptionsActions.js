import { UPDATE_TRADING_OPTIONS } from '../_constants/ActionTypes';
import * as LiveData from '../_data/LiveData';

export const updateTradingOptions = (symbol, options) => ({
    type: UPDATE_TRADING_OPTIONS,
    symbol,
    options,
});

export const getTradingOptions = (symbol, onDone) =>
    (dispatch, getState) => {
        const { tradingOptions } = getState();
        if (!tradingOptions.get(symbol)) {
            LiveData.api.getContractsForSymbol(symbol).then(res => {
                dispatch(updateTradingOptions(symbol, res.contracts_for.available));
                if (onDone) onDone();
            });
        } else {
            if (onDone) onDone();
        }
    };
