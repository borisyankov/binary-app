import { createSelector, createStructuredSelector } from 'reselect';
import { durationUnits } from '../_constants/TradeParams';
import { groupByKey, arrayToObject } from '../_utils/ArrayUtils';
import { durationToSecs } from '../_utils/TradeUtils';
import {
    epochToUTCTimeString,
    nowAsEpoch,
    splitSecsToUnits,
    timeStringIsBetween,
} from '../_utils/DateUtils';
import { marketTreeSelector } from './AssetSelectors';

import { tradingTimesSelector } from './TradingTimesSelectors';

const normalizedContractFor = contracts => {
    const extraRemoved = contracts.map(contract => ({
        amount_per_point: contract.amount_per_point,
        barrier: contract.barrier,
        barriers: contract.barriers,
        contract_category: contract.contract_category,
        contract_category_display: contract.contract_category_display,
        contract_display: contract.contract_display,
        contract_type: contract.contract_type,
        expiry_type: contract.expiry_type,
        forward_starting_options: contract.forward_starting_options,
        high_barrier: contract.high_barrier,
        last_digit_range: contract.last_digit_range,
        low_barrier: contract.low_barrier,
        min_contract_duration: contract.min_contract_duration,
        max_contract_duration: contract.max_contract_duration,
        stop_type: contract.stop_type,
        stop_loss: contract.stop_loss,
        stop_profit: contract.stop_profit,
    }));

    const groupByCategory = groupByKey(extraRemoved, 'contract_category');
    const allCategory = Object.keys(groupByCategory);
    allCategory.forEach(c => {
        const relatedContracts = groupByCategory[c];
        const groupByType = groupByKey(relatedContracts, 'contract_type');
        groupByCategory[c] = groupByType;
    });

    return groupByCategory;
};

const extractBarrier = (contracts, type) => {
    const extractDigitBarrierHelper = contractsGroupedByExpiry => {
        const expiryTypes = Object.keys(contractsGroupedByExpiry);
        const result = {};
        expiryTypes.forEach(et => {
            const contractsByExpiry = contractsGroupedByExpiry[et];
            result[et] = [{
                name: 'Digit',
                values: contractsByExpiry[0].last_digit_range,
                defaultValue: contractsByExpiry[0].last_digit_range[0],
            }];
        });
        return result;
    };
    const extract2BarriersHelper = contractsGroupedByExpiry => {
        const expiryTypes = Object.keys(contractsGroupedByExpiry);
        const result = {};
        expiryTypes.forEach(et => {
            const contractsByExpiry = contractsGroupedByExpiry[et];
            result[et] = [
                { name: 'High barrier', defaultValue: contractsByExpiry[0].high_barrier },
                { name: 'Low barrier', defaultValue: contractsByExpiry[0].low_barrier },
            ];
        });
        return result;
    };
    const extract1BarrierHelper = (contractGroupedByExpiry, barrierName) => {
        const expiryTypes = Object.keys(contractGroupedByExpiry);
        const result = {};
        expiryTypes.forEach(et => {
            const contractsByExpiry = contractGroupedByExpiry[et];
            const contractWithBarrier = contractsByExpiry.find(c => !!c.barrier);
            if (!contractWithBarrier) {
                return;
            }
            result[et] = [{ name: barrierName, defaultValue: contractWithBarrier.barrier }];
        });
        return result;
    };

    const groupByExpiryType = groupByKey(contracts, 'expiry_type');
    switch (type) {
        case 'CALL':
            return extract1BarrierHelper(groupByExpiryType, 'Higher than');
        case 'PUT':
            return extract1BarrierHelper(groupByExpiryType, 'Lower than');
        case 'ASIANU':
        case 'ASIAND':
            return undefined;
        case 'DIGITMATCH':
        case 'DIGITDIFF':
            return extractDigitBarrierHelper(groupByExpiryType);
        case 'DIGITODD':
        case 'DIGITEVEN':
            return undefined;
        case 'DIGITOVER':
        case 'DIGITUNDER':
            return extractDigitBarrierHelper(groupByExpiryType);
        case 'EXPIRYMISS':
        case 'EXPIRYRANGE':
        case 'RANGE':
        case 'UPORDOWN':
            return extract2BarriersHelper(groupByExpiryType);
        case 'ONETOUCH':
        case 'NOTOUCH':
            return extract1BarrierHelper(groupByExpiryType, 'Touch spot');
        case 'SPREADU':
        case 'SPREADD':
            return undefined;
        default: {
            throw new Error('Unknown trading type');
        }
    }
};

const durationSecHelper = duration => {
    const d = +duration.slice(0, -1);
    const u = duration.slice(-1);
    return durationToSecs(d, u);
};

const extractMinMaxInUnits = (min, max) => {
    // block is a structure that describe min and max of specific time unit
    const blockIsValid = (minArg, maxArg, unit) => {
        if (maxArg < 1) {
            return false;
        }
        switch (unit) {
            case 's': return minArg < 60;
            case 'm': return minArg < 60;
            case 'h': return minArg < 24;
            case 'd': return true;
            default: throw new Error('Invalid time unit');
        }
    };
    const minInUnits = splitSecsToUnits(min);
    const maxInUnits = splitSecsToUnits(max);
    const durations = [];
    for (let i = 0; i < minInUnits.length; i++) {
        const unit = durationUnits[i + 1];
        const minI = minInUnits[i];
        const maxI = maxInUnits[i];
        if (blockIsValid(minI, maxI, unit)) {
            durations.push({
                unit,
                min: minI > 0 ? minI : 1,
                max: maxI });
        }
    }
    return durations;
};

const extractDurationHelper = (contracts, type) => {
    if (type.indexOf('SPREAD') > -1) {
        return [];
    }

    const tickContracts = contracts.filter(c => c.min_contract_duration.slice(-1) === 't');
    const tickDuration = tickContracts.length > 0 ? { min: 5, max: 10, unit: 't' } : undefined;

    const nonTickContracts = contracts.filter(c => c.min_contract_duration.slice(-1) !== 't');
    if (nonTickContracts.length === 0) {
        return [tickDuration];
    }
    const nonTickMinSec = nonTickContracts
        .map(c => durationSecHelper(c.min_contract_duration))
        .reduce((a, b) => Math.min(a, b));

    const nonTickMaxSec = nonTickContracts
        .map(c => durationSecHelper(c.max_contract_duration))
        .reduce((a, b) => Math.max(a, b));

    const nonTicksDuration = extractMinMaxInUnits(nonTickMinSec, nonTickMaxSec);
    if (tickDuration) {
        nonTicksDuration.unshift(tickDuration);
    }

    return nonTicksDuration;
};

const extractForwardStartingDuration = (contracts, type) => {
    const forwardStartingContracts = contracts.filter(c => !!c.forward_starting_options);
    if (forwardStartingContracts.length === 0) {
        return undefined;
    }

    if (forwardStartingContracts.length > 1) {
        throw new Error('Assumption broken, more than one contract with forward starting options');
    }

    const forwardOptions = forwardStartingContracts[0].forward_starting_options;
    const groupByDate = groupByKey(forwardOptions, 'date');
    const forwardStartingRange = [];
    Object.keys(groupByDate)
        .sort((a, b) => +a > +b)
        .forEach(date => {
            const timesPerDateArr = groupByDate[date].map(obj => {
                const open = new Date(obj.open * 1000);
                const close = new Date(obj.close * 1000);
                return { open, close };
            });
            const timesPerDateObj = arrayToObject(timesPerDateArr);
            forwardStartingRange.push({ date: new Date(date * 1000), ...timesPerDateObj });
        });

    const forwardStartingDurations = extractDurationHelper(forwardStartingContracts, type);
    return {
        range: forwardStartingRange,
        options: forwardStartingDurations,
    };
};

const extractDuration = (contracts, type) => {
    // const forwardStartingDuration = contracts.filter(c => !!c.forward_starting_options);
    const nonForwardStartingContracts = contracts.filter(c => !c.forward_starting_options);

    return extractDurationHelper(nonForwardStartingContracts, type);
};

const extractSpreadInfo = contracts => {
    const amountPerPoint = contracts[0].amount_per_point;
    const stopType = contracts[0].stop_type;
    const stopLoss = contracts[0].stop_loss;
    const stopProfit = contracts[0].stop_profit;

    return {
        amountPerPoint,
        stopType,
        stopLoss,
        stopProfit,
    };
};

/**
 * end result should contain information
 * to generate form, requires
 * list of min, max, unit [{ min, max, unit}]
 * list of [{barrier_name, barrier_default}]
*/
const contractAggregation = (contracts, type) => ({
    barriers: extractBarrier(contracts, type),
    durations: extractDuration(contracts, type),
    forwardStartingDuration: extractForwardStartingDuration(contracts, type),
    spread: (type.indexOf('SPREAD') > -1) ? extractSpreadInfo(contracts) : null,
});

const contractsSelector = state => {
    const allContracts = state.tradingOptions.map(symbol => {
        const normalized = normalizedContractFor(symbol);
        Object.keys(normalized).forEach(category => {
            const categoryObj = normalized[category];
            Object.keys(categoryObj).forEach(type => {
                const contractsPerType = contractAggregation(categoryObj[type], type);
                categoryObj[type] = contractsPerType;
            });
            normalized[category] = categoryObj;
        });
        return normalized;
    });
    return allContracts.toJS();
};

export const tradesSelector = state => state.trades.toJS();

const availableAssetsFilter = (assets, times, now) => {
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

const symbolsToArray = symbols =>
    Object.keys(symbols).map(v => ({
        text: symbols[v].display_name,
        value: v,
    }));

const submarketsToSymbols = submarkets =>
    Object.keys(submarkets).reduce((r, v) =>
        r.concat(symbolsToArray(submarkets[v].symbols)),
        []
    );

const flattenSubmarkets = markets => {
    const flatten = {};
    Object.keys(markets).forEach(m =>
        flatten[m] = submarketsToSymbols(markets[m].submarkets)
    );
    return flatten;
};

const availableAssetsSelector = createSelector(
    [tradingTimesSelector, marketTreeSelector],
    (tradingTimes, marketTree) => {
        const assetsGroupByMarkets = flattenSubmarkets(marketTree);
        const filteredAssets = {};
        Object.keys(assetsGroupByMarkets).forEach(m =>
            filteredAssets[m] = availableAssetsFilter(assetsGroupByMarkets[m], tradingTimes, nowAsEpoch())
        );
        return filteredAssets;
    }
);

const ticksSelector = state => state.ticks.toJS();

const currencySelector = state => state.account.get('currency');

const tradesIdsSelector = createSelector(
    tradesSelector,
    trades =>
        Object.keys(trades)
);

// only get numeric keys, as tick trade does not support multiple panel
export const maxTradeIdSelector = state => {
    const tradesIds = state.trades.keySeq().filter(k => !isNaN(+k));
    return tradesIds.reduce((a, b) => Math.max(a, b), -1);
};

export const fullTradesSelector = createStructuredSelector({
    contracts: contractsSelector,
    trades: tradesSelector,
    tradesIds: tradesIdsSelector,
    assets: availableAssetsSelector,
    ticks: ticksSelector,
    currency: currencySelector,
});
