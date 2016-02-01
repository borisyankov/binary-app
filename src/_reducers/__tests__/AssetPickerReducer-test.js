import expect from 'expect';
import { fromJS, Map } from 'immutable';
import * as actions from '../../_actions/AssetPickerActions';
import AssetPickerReducer from '../AssetPickerReducer';

const getInitialState = (props) => ({
    query: '',
    submarket: '',
    ...props
});

describe('AssetPickerReducers', () => {
    describe('updateAssetPickerSearchQuery', () => {
        it('should return empty result when given empty asset list with empty query', () => {
            const stateBefore = fromJS();
            const actual = AssetPickerReducer(stateBefore, actions.updateAssetPickerSearchQuery(''));
            const expected = fromJS(getInitialState());
            expect(actual.toJS()).toEqual(expected.toJS());
        });

        it('when query is empty returns all assets', () => {
            const stateBefore = fromJS(getInitialState({
                availableAssets: [{ display_name: 'asset1' }, { display_name: 'asset2' }, { display_name: 'asset3' }],
            }));
            const actual = AssetPickerReducer(stateBefore, actions.updateAssetPickerSearchQuery('')).toJS();
            const expected = getInitialState({
                availableAssets: [{ display_name: 'asset1' }, { display_name: 'asset2' }, { display_name: 'asset3' }],
            });
            expect(actual.availableAssets).toEqual(expected.availableAssets);
        });

        it('query containing only spaces is treated as empty', () => {
            const stateBefore = fromJS(getInitialState({
                availableAssets: [{ display_name: 'asset1' }, { display_name: 'asset2' }, { display_name: 'asset3' }],
            }));
            const actual = AssetPickerReducer(stateBefore, actions.updateAssetPickerSearchQuery('     ')).toJS();
            const expected = fromJS(getInitialState({
                availableAssets: [{ display_name: 'asset1' }, { display_name: 'asset2' }, { display_name: 'asset3' }],
            })).toJS();
            expect(actual.availableAssets).toEqual(expected.availableAssets);
        });
    });

    describe('updateAssetPickerMarkets', () => {
    });

    describe('updateAssetPickerSubmarket', () => {
    });
});
