import { createSelector, createStructuredSelector } from 'reselect';
import { toPlainJS } from '../_utils/ObjectUtils';

export const assetsSelector = state => toPlainJS(state.assets);

// return a tree structure, hierarchy as [market -> submarket -> symbol]
export const marketTreeSelector = createSelector(
    assetsSelector,
    assets =>
        assets.reduce((tree, sym) => {
            if (!tree[sym.market]) {
                tree[sym.market] = {
                    display_name: sym.market_display_name,
                    submarkets: {},
                };
            }

            if (!tree[sym.market].submarkets[sym.submarket]) {
                tree[sym.market].submarkets[sym.submarket] = {
                    display_name: sym.submarket_display_name,
                    symbols: {},
                };
            }

            if (!tree[sym.market].submarkets[sym.submarket].symbols[sym.symbol]) {
                tree[sym.market].submarkets[sym.submarket].symbols[sym.symbol] = {
                    display_name: sym.display_name,
                };
            }

            return tree;
        }, {})
);

// export const submarketNameSelector = Object.keys(tree).map(market => {
//     const subs = tree[market].submarkets;
//     if (Object.keys(subs).indexOf(submarket) > -1) return subs[submarket].display_name;
// }).filter(name => !!name)[0];


export default createStructuredSelector({
    assets: assetsSelector,
    marketTree: marketTreeSelector,
//    submarketName: submarketNameSelector,
});
