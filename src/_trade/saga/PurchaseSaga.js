import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import changeAmount from '../updates/changeAmount';
import {
    updateMultipleTradeParams,
    updateOpenContractField,
} from '../../_actions';
import { getParams, getProposalId } from './SagaSelectors';
import { api } from '../../_data/LiveData';
import {
    updatePurchasedContract,
    updateTradeError,
} from '../../_actions/TradeActions';
import {
    unsubscribeProposal,
    subscribeProposal,
} from './ProposalSubscriptionSaga';

const CHANGE_STAKE = 'CHANGE_STAKE';
const PURCHASE = 'PURCHASE';

export const reqStakeChange = (index, stake) => ({
    type: CHANGE_STAKE,
    index,
    stake,
});

export const reqPurchase = (index, price, onPurchaseDone) => ({
    type: PURCHASE,
    index,
    price,
    onPurchaseDone,
});

function* handleStakeChange(action) {
    const { index, stake } = action;

    yield put(unsubscribeProposal(index));

    if (+stake <= 0 || stake === '') {
        yield put(
            updateTradeError(index, 'stakeError', 'Stake must be more than 0'),
        );
        return;
    }

    const params = yield select(getParams(index));
    const updated = changeAmount(stake, params);
    yield [
        put(updateMultipleTradeParams(index, updated)),
        put(subscribeProposal(index, updated)),
    ];
}

function* handlePurchase(action) {
    const { index, price, onPurchaseDone } = action;
    const params = yield select(getParams(index));
    const pid = yield select(getProposalId(index));
    try {
        // Note: we do not call subscribeToOpenContract here, as it will be triggered by transaction stream
        // reason: we want it to be trigger from transaction stream so that when user buy from other device, we still get the update
        // code: src/_actions/StatementActions
        const { buy } = yield api.buyContract(pid, price);
        yield put(
            updateOpenContractField({
                ...buy,
                id: buy.contract_id,
                date_start: buy.start_time,
                transaction_ids: { buy: buy.transaction_id },
            }),
        );
        onPurchaseDone();
        yield put(updatePurchasedContract(index, buy));
    } catch (err) {
        if (!err.error || !err.error.error) {
            throw err; // rethrow error that we do not expect
        }
        yield put(
            updateTradeError(index, 'serverError', err.error.error.message),
        );
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
