import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import * as paramUpdate from '../TradeParamsCascadingUpdates';
import { updateMultipleTradeParams } from '../../_actions';
import { getParams, getProposalId } from './SagaSelectors';
import { api } from '../../_data/LiveData';
import { updatePurchasedContract, updateTradeError } from '../../_actions/TradeActions';
import { unsubscribeProposal, subscribeProposal } from './ProposalSubscriptionSaga';

const CHANGE_STAKE = 'CHANGE_STAKE';
const PURCHASE = 'PURCHASE';


export const reqStakeChange = (index, stake) => ({
    type: CHANGE_STAKE,
    index,
    stake,
});

export const reqPurchase = (index, price, purchaseHook) => ({
    type: PURCHASE,
    index,
    price,
    purchaseHook,
});

function* handleStakeChange(action) {
    const { index, stake } = action;
    yield put(unsubscribeProposal(index));
    const params = yield select(getParams(index));
    const updated = paramUpdate.changeAmount(stake, params);
    yield [
        put(updateMultipleTradeParams(index, updated)),
        put(subscribeProposal(index, updated)),
        ];
}

function* handlePurchase(action) {
    const { index, price, purchaseHook } = action;
    const params = yield select(getParams(index));
    const pid = yield select(getProposalId(index));
    try {
        const { buy } = yield api.buyContract(pid, price).then(r => {
            purchaseHook(r);
            return r;
        });
        yield [
            put(updatePurchasedContract(index, buy)),
            api.subscribeToOpenContract(buy.contract_id),           // TODO: do I need to call getDataForContract?
            ];
    } catch (err) {
        yield put(updateTradeError(index, 'purchaseError', err.error.error.message));
    } finally {
        yield put(subscribeProposal(index, params));
    }
}

export default function* watchPurchase() {
    yield [
        takeEvery(CHANGE_STAKE, handleStakeChange),
        takeEvery(PURCHASE, handlePurchase),
        ];
}
