import { createSelector } from 'reselect';
import { pipsToDigits, calculateLastDigitStats } from 'binary-utils';
import { ticksSelector, workspaceSelector, digitStatsSelector,
    tradingOptionsSelector, assetsSelector } from '../_store/directSelectors';

export default createSelector(
    [ticksSelector, tradingOptionsSelector, digitStatsSelector, assetsSelector, workspaceSelector],
    (ticks, tradingOptions, digitStats, assets, workspace) => {
        const assetExist = assets.find(x => x.get('symbol') === workspace.get('infoForAsset'));
        const selectedAsset = assetExist ?
                                assetExist.get('symbol') :
                                assets.find(a => a.get('exchange_is_open') === 1).get('symbol');
        const assetSupportsDigit = selectedAsset &&
            tradingOptions.get(selectedAsset) &&
            tradingOptions.get(selectedAsset).some(opt => opt.contract_category === 'digits');

        const selectAssetTicks = assetSupportsDigit && ticks.get(selectedAsset);
        if (!selectAssetTicks) return undefined;

        const pipSize = assets.find(a => a.get('symbol') === selectedAsset).get('pip');
        const size = digitStats.get('filter');
        const lastTicks = selectAssetTicks.takeLast(size).toJS();

        return {
            filter: size,
            stats: calculateLastDigitStats(lastTicks, pipsToDigits(pipSize)),
            symbol: selectedAsset,
        };
    }
);
