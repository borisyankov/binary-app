import { boughtContractsSelector, portfolioSelector, assetsSelector } from '../_store/directSelectors';
import { createSelector, createStructuredSelector } from 'reselect';
import pipsToDigits from 'binary-utils/lib/pipsToDigits';

const contractToShow = createSelector(
    [state => portfolioSelector(state).get('contractShown'), boughtContractsSelector],
    (contractID, contracts) => {
        const contract = contracts.find(x => x.get('contract_id') === contractID);
        return contract;
    }
);

const contractWithBarrierType = createSelector(
    contractToShow,
    contract => contract && contract.set('barrierType', 'absolute')
);

const dataToShow = createSelector(
    portfolioSelector,
    state => state.chartData,
    (portfolio, chartData) => chartData.find((v, k) => k === portfolio.get('contractShown'))
);

const pipSizeSelector = createSelector(
    assetsSelector,
    contractToShow,
    (assets, contract) => {
        const symbolDetails = assets.find(a => a.get('symbol') === contract.get('underlying'));
        const pipSize = symbolDetails && pipsToDigits(symbolDetails.get('pip'));
        return pipSize;
    }
);

export default createStructuredSelector({
    // ticks: ticksSelector,
    ticks: dataToShow,
    contract: contractWithBarrierType,
    pipSize: pipSizeSelector,
});
