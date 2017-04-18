import { nowAsEpoch } from 'binary-utils';
import * as types from '../_constants/ActionTypes';
import { api } from '../_data/LiveData';
import { sellExpiredContract } from './TradeActions';

export const serverDataPortfolio = serverResponse => ({
    type: types.SERVER_DATA_PORTFOLIO,
    serverResponse,
});

export const subscribeToOpenContract = contractId => (dispatch, getState) => {
    const boughtContracts = getState().boughtContracts;
    if (!boughtContracts.get(contractId)) {
        return api.subscribeToOpenContract(contractId).then(response => {
            if (Object.keys(response.proposal_open_contract).length > 0) {
                return response.proposal_open_contract;
            }
            return Promise.reject('Contract does not exist');
        });
    }
    return Promise.resolve(boughtContracts.get(contractId).toJS());
};

export const getOpenContract = contractId => (dispatch, getState) => {
    const boughtContracts = getState().boughtContracts;
    if (!boughtContracts.get(contractId)) {
        return api
            .getContractInfo(contractId)
            .then(response => response.proposal_open_contract);
    }
    return Promise.resolve(boughtContracts.get(contractId).toJS());
};

export const detailsForContract = contractShown => {
    if (!contractShown) {
        return {
            type: types.DETAILS_FOR_CONTRACT,
            contractShown,
        };
    }
    return dispatch => {
        const openContract = dispatch(subscribeToOpenContract(contractShown));
        return openContract.then(() =>
            dispatch({ type: types.DETAILS_FOR_CONTRACT, contractShown }),
        );
    };
};

export const serverDataProposalOpenContract = serverResponse => {
    if (serverResponse.proposal_open_contract.is_expired) {
        sellExpiredContract();
    }
    return { type: types.SERVER_DATA_PROPOSAL_OPEN_CONTRACT, serverResponse };
};

export const updateOpenContractField = openContractField => ({
    type: types.UPDATE_OPEN_CONTRACT_FIELD,
    openContractField,
});

export const updateNow = () => ({
    type: types.UPDATE_NOW,
    now: nowAsEpoch(),
});
