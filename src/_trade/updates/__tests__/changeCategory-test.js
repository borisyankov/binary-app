import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import rawContract from 'binary-test-data/contractsForR50';
import changeCategory from '../changeCategory';
import { tradingOptionsForOneSymbol } from '../../../trade-params/TradeParamsSelector';
import areAllTimeFieldsValid from '../../validation/areAllTimeFieldsValid';

chai.use(chaiSubset);

describe('Update helpers', () => {
    const mockTickTrade = {
        showAssetPicker: false,
        tradeCategory: 'risefall',
        symbolName: 'Volatility 100 Index',
        duration: 5,
        amount: 50,
        durationUnit: 't',
        symbol: 'R_100',
        pipSize: 2,
        type: 'CALL',
        disabled: false,
        basis: 'stake',
    };
    const mockedContract = tradingOptionsForOneSymbol(rawContract);

    describe('changeCategory', () => {
        it('should change category', () => {
            const updatedCategory = changeCategory('risefall', mockedContract);
            expect(updatedCategory.tradeCategory).to.equal('risefall');
        });

        it('should setup params for new category if needed', () => {
            const updatedCategory = changeCategory('spreads', mockedContract);
            expect(updatedCategory).to.contains.keys('stopLoss', 'stopProfit', 'amountPerPoint');
        });

        it('should return start later trade if market is close', () => {
            const updated = changeCategory('risefall', mockedContract, mockTickTrade, false);
            expect(updated.dateStart).to.not.be.undefined;
        });

        it('should NOT return start later trade if market is close', () => {
            const updated = changeCategory('risefall', mockedContract, mockTickTrade, true);
            expect(updated.dateStart).to.be.undefined;
        });

        it('should return a sane params if invalid category is passed into it', () => {
            const { duration, durationUnit, dateStart, tradeCategory, type } =
                changeCategory('super', mockedContract, mockTickTrade);
            const isValid = areAllTimeFieldsValid(dateStart, duration, durationUnit, mockedContract[tradeCategory][type]);
            expect(isValid).to.equal(true);
        });
    });
});
