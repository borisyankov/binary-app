import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { updateMultipleTradeParams, updateTradeUIState, updateTradeError } from '../../_actions';
import { allTimeRelatedFieldValid } from '../TradeParamsValidation';
import * as paramUpdate from '../TradeParamsCascadingUpdates';
import { getParams, contractOfSymbol, getForceRenderCount } from './SagaSelectors';
import { dateToEpoch, timeStringToSeconds } from 'binary-utils';
import { subscribeProposal, unsubscribeProposal } from './ProposalSubscriptionSaga';

const CHANGE_DURATION = 'CHANGE_DURATION';

export const reqDurationChange = (index, duration) => ({
    type: CHANGE_DURATION,
    index,
    duration,
});

function* handleDurationChange(action) {
    const { index, duration } = action;
    yield put(unsubscribeProposal(index));
    const params = yield select(getParams(index));
    const { symbol, tradeCategory, type, durationUnit, dateStart } = params;
    const contractNeeded = yield select(contractOfSymbol(symbol));
    const contractPerType = contractNeeded[tradeCategory][type];
    const isDurationAllowed = allTimeRelatedFieldValid(dateStart, duration, durationUnit, contractPerType);
    if (isDurationAllowed) {
        const updated = Object.assign(params, { duration });
        yield [
            put(subscribeProposal(index, updated)),
            put(updateMultipleTradeParams(index, updated)),
            put(updateTradeError(index, 'durationError')),
        ];
    } else {
        yield put(updateTradeError(index, 'durationError', 'Duration is out of range.'));
    }
}


const CHANGE_DURATION_UNIT = 'CHANGE_DURATION_UNIT';

export const reqDurationUnitChange = (index, durationUnit) => ({
    type: CHANGE_DURATION_UNIT,
    index,
    durationUnit,
});

function* handleDurationUnitChange(action) {
    const { index, durationUnit } = action;
    yield put(unsubscribeProposal(index));
    const params = yield select(getParams(index));
    const contractNeeded = yield select(contractOfSymbol(params.symbol));
    const updated = paramUpdate.changeDurationUnit(durationUnit, contractNeeded, params);
    const renderCount = yield select(getForceRenderCount(index));
    yield [
        put(subscribeProposal(index, updated)),
        put(updateMultipleTradeParams(index, updated)),
        put(updateTradeUIState(index, 'forceRenderCount', renderCount + 1)),
    ];
}

const CHANGE_START_DATE_EPOCH = 'CHANGE_START_DATE_EPOCH';

export const reqStartEpochChange = (index, epoch) => ({
    type: CHANGE_START_DATE_EPOCH,
    index,
    epoch,
});

function* handleStartEpochChange(action) {
    const { index, epoch } = action;
    yield put(unsubscribeProposal(index));
    const params = yield select(getParams(index));
    const { symbol, tradeCategory, type, durationUnit, duration } = params;
    const contractNeeded = yield select(contractOfSymbol(symbol));
    const contractPerType = contractNeeded[tradeCategory][type];
    const durationAllowed = allTimeRelatedFieldValid(epoch, duration, durationUnit, contractPerType);
    if (durationAllowed) {
        const updated = Object.assign(params, { dateStart: epoch });
        yield [
            put(subscribeProposal(index, updated)),
            put(updateMultipleTradeParams(index, updated)),
            put(updateTradeError(index, 'durationError')),
        ];
    } else {
        yield put(updateTradeError(index, 'durationError', 'Start date invalid, it needs to be five minutes or more in the future.'));
    }
}

const CHANGE_START_DATE_STRING = 'CHANGE_START_DATE_STRING';

export const reqStartDateChange = (index, date) => ({
    type: CHANGE_START_DATE_STRING,
    index,
    date,
});

function* handleStartDateChange(action) {
    const { index, date } = action;
    yield put(unsubscribeProposal(index));
    const params = yield select(getParams(index));
    const { symbol, tradeCategory, type, durationUnit, dateStart, duration } = params;

    const newDayEpoch = dateToEpoch(new Date(date));
    if (!newDayEpoch) {
        yield put(updateTradeError(index, 'durationError', 'Start date invalid, it needs to be five minutes or more in the future.'));
        return;
    }

    const secondsPerDay = 60 * 60 * 24;
    const intraDayEpoch = dateStart % secondsPerDay;
    const newDateStart = newDayEpoch + intraDayEpoch;

    const contractNeeded = yield select(contractOfSymbol(symbol));
    const contractPerType = contractNeeded[tradeCategory][type];
    const durationAllowed = allTimeRelatedFieldValid(newDateStart, duration, durationUnit, contractPerType);
    if (durationAllowed) {
        const updated = Object.assign(params, { dateStart: newDateStart });
        yield [
            put(subscribeProposal(index, updated)),
            put(updateMultipleTradeParams(index, updated)),
            put(updateTradeError(index, 'durationError')),
        ];
    } else {
        yield put(updateTradeError(index, 'durationError', 'Start date invalid, it needs to be five minutes or more in the future.'));
    }
}

const CHANGE_START_TIME_STRING = 'CHANGE_START_TIME_STRING';

export const reqStartTimeChange = (index, time) => ({
    type: CHANGE_START_TIME_STRING,
    index,
    time,
});

function* handleStartTimeChange(action) {
    const { index, time } = action;
    yield put(unsubscribeProposal(index));
    const params = yield select(getParams(index));
    const { symbol, tradeCategory, type, durationUnit, dateStart, duration } = params;

    const secondsPerDay = 60 * 60 * 24;
    const intraDayEpoch = dateStart % secondsPerDay;
    const dayEpoch = dateStart - intraDayEpoch;
    const newDateStart = dayEpoch + timeStringToSeconds(time);

    const contractNeeded = yield select(contractOfSymbol(symbol));
    const contractPerType = contractNeeded[tradeCategory][type];
    const durationAllowed = allTimeRelatedFieldValid(newDateStart, duration, durationUnit, contractPerType);

    if (durationAllowed) {
        const updated = Object.assign(params, { dateStart: newDateStart });
        yield [
            put(subscribeProposal(index, updated)),
            put(updateMultipleTradeParams(index, updated)),
            put(updateTradeError(index, 'durationError')),
        ];
    } else {
        yield put(updateTradeError(index, 'durationError', 'Start date invalid, it needs to be five minutes or more in the future.'));
    }
}

export default function* watchDurationChange() {
    yield [
        takeEvery(CHANGE_DURATION, handleDurationChange),
        takeEvery(CHANGE_DURATION_UNIT, handleDurationUnitChange),
        takeEvery(CHANGE_START_DATE_STRING, handleStartDateChange),
        takeEvery(CHANGE_START_TIME_STRING, handleStartTimeChange),
        takeEvery(CHANGE_START_DATE_EPOCH, handleStartEpochChange),
    ];
}
