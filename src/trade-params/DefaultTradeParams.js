import { isIntraday, dateToEpoch } from 'binary-utils';

export const createDefaultCategory = contracts => Object.keys(contracts)[0];

export const createDefaultType = (contracts, category) =>
    Object.keys(contracts[category])[0];

export const createDefaultStartLaterEpoch = forwardStartingDuration => {
    const nextDayOpening = dateToEpoch(forwardStartingDuration.range[1].open[0]);
    return nextDayOpening + (60 * 15);                      // 15 minutes * 60 secs
};

export const createDefaultDuration = (contracts, category, type, isOpen = true) => {
    if (category === 'spreads') {
        return undefined;
    }
    const d = contracts[category][type].durations;

    if (!!d && isOpen) {
        return {
            duration: d[0].min,
            durationUnit: d[0].unit,
        };
    }
    const forwardD = contracts[category][type].forwardStartingDuration;

    return {
        dateStart: createDefaultStartLaterEpoch(forwardD),
        duration: forwardD.options[0].min,
        durationUnit: forwardD.options[0].unit,
    };
};

export const createDefaultBarriers = (contracts, category, type, duration, durationUnit) => {
    if (category === 'spreads') {
        return [undefined, undefined];
    }

    let expiryType;
    if (durationUnit === 't') {
        expiryType = 'tick';
    } else if (isIntraday(duration, durationUnit)) {
        expiryType = 'intraday';
    } else {
        expiryType = 'daily';
    }

    const barriers = contracts[category][type].barriers;
    if (!barriers) {
        return [undefined, undefined];
    }

    const barrierByExpiry = barriers[expiryType];
    if (category === 'digits') {
        return [barrierByExpiry && barrierByExpiry[0].defaultValue];
    }

    if (!barrierByExpiry) {
        // this expiry type have no barrier
        return [undefined, undefined];
    }

    if (barrierByExpiry.length === 1) {
        switch (expiryType) {
            case 'tick':
            case 'intraday':
            case 'daily': return [+barrierByExpiry[0].defaultValue];
            default: throw new Error('unknown expiry');
        }
    }

    if (barrierByExpiry.length === 2) {
        switch (expiryType) {
            case 'tick':
            case 'intraday':
            case 'daily': return [+barrierByExpiry[0].defaultValue, +barrierByExpiry[1].defaultValue];
            default: throw new Error('unknown expiry');
        }
    }

    throw new Error('default barrier creation failed');
};

export const createDefaultBarrierType = (duration, durationUnit, cat) => {
    if (cat === 'digits') {
        return undefined;
    }
    if (durationUnit === 't' || isIntraday(duration, durationUnit)) {
        return 'relative';
    }
    return 'absolute';         // did not use return directly as ESLint complain about it
};

export const createDefaultTradeParams = (contracts, symbol, isOpen) => {
    const cat = createDefaultCategory(contracts);
    const type = createDefaultType(contracts, cat);
    const { duration, durationUnit } = createDefaultDuration(contracts, cat, type, isOpen);
    const barriers = createDefaultBarriers(contracts, cat, type, duration, durationUnit);
    const barrierType = createDefaultBarrierType(duration, durationUnit, cat);

    const startLaterOpts = contracts[cat][type].forwardStartingDuration;
    const dateStart = isOpen ? undefined : startLaterOpts && createDefaultStartLaterEpoch(startLaterOpts);
    return {
        symbol,
        tradeCategory: cat,
        duration,
        durationUnit,
        dateStart,
        basis: 'stake',
        amount: 50,
        type,
        barrierType,
        barrier: barriers[0],
        barrier2: barriers[1],
    };
};
