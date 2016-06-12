import * as types from '../_constants/ActionTypes';

export const serverDataStatement = serverResponse => ({
    type: types.SERVER_DATA_STATEMENT,
    serverResponse,
});

export const serverTransactionStream = serverResponse => ({
    type: types.SERVER_DATA_TRANSACTION,
    serverResponse,
});

export const removeStatementPersonalData = () => ({
    type: types.REMOVE_STATEMENT_PERSONAL_DATA,
});
