import { fromJS } from 'immutable';
import expect from 'expect';
import assetIndexSelectors, { assetIndexSelector, durationsSelector } from '../AssetIndexSelectors';

describe.skip('AssetIndexSelectors', () => {

    describe('assetIndexSelector', () => {
        it('should be retrieved', () => {
            const actual = assetIndexSelector({
                assetIndex: [
                    [[], [], []]
                ],
            });
            expect(actual).toEqual([[[], [], []]]);
        });
    });

    describe('durationsSelector', () => {
        it('should be retrieved', () => {
            const actual = durationsSelector({
                assets: [],
                assetIndex: [
                    ['', '', [[], []]]
                ],
                workspace: {
                    assetIndex: 0
                },
            });
            expect(actual).toEqual([]);
        });
    });


    describe('assetIndexSelectors', () => {
        it('should be initialized successfully', () => {
            const actual = assetIndexSelectors({
                assets: [],
                assetIndex: [
                    ['', '', [[], []]]
                ],
                workspace: {
                    assetIndex: 0
                },
            });
            expect(actual).toExist();
        });
    });
});
