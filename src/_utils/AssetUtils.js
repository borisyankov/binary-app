import { epochToUTCTimeString, timeStringIsBetween } from '../_utils/DateUtils';

export const symbolsToArray = symbols =>
    Object.keys(symbols).map(v => ({
        text: symbols[v].display_name,
        value: v,
    }));

export const submarketsToSymbols = submarkets =>
    Object.keys(submarkets).reduce((r, v) =>
        r.concat(symbolsToArray(submarkets[v].symbols)),
        []
    );

export const flattenSubmarkets = markets =>
    Object.keys(markets).reduce((acc, m) => {
        acc[m] = submarketsToSymbols(markets[m].submarkets);
        return acc;
    }, {});

export const availableAssetsFilter = (assets, times, now) => {
    const nowInTimeString = epochToUTCTimeString(now);
    const availabilities = {};

    times.forEach(s => {
        if (!s.times) {
            return;
        }
        const open = s.times.open;
        const close = s.times.close;

        // Assuming closing time is larger than open time
        if (s.name.indexOf('Random') > -1) {
            availabilities[s.symbol] = true;
        } else if (open.length === 1) {
            if (timeStringIsBetween(open[0], close[0], nowInTimeString)) {
                availabilities[s.symbol] = true;
            }
        } else if (open.length === 2) {
            if (timeStringIsBetween(open[0], close[0], nowInTimeString) ||
                timeStringIsBetween(open[1], close[1], nowInTimeString)) {
                availabilities[s.symbol] = true;
            }
        }
    });
    const availableAssets = assets.filter(s => availabilities[s.value]);

    return availableAssets;
};
