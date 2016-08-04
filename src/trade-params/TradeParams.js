import React, { PureComponent, PropTypes } from 'react';
import { askPriceFromProposal, windowResizeEvent } from 'binary-utils';
import { Error } from 'binary-components';
import Modal from '../containers/Modal';
import { actions } from '../_store';
import BarrierCard from '../barrier-picker/BarrierCard';
// import SpreadBarrierCard from '../barrier-picker/SpreadBarrierCard';
import DigitBarrierCard from '../barrier-picker/DigitBarrierCard';
import DurationCard from '../duration-picker/DurationCard';
import ForwardStartingOptions from '../duration-picker/ForwardStartingOptions';
import StakeCard from '../payout-picker/StakeCard';
import PayoutCard from '../payout-picker/PayoutCard';
import TradeTypeDropDown from '../trade-type-picker/TradeTypeDropDown';
import AssetPickerDropDown from '../asset-picker/AssetPickerDropDown';
import BuyButton from './BuyButton';

/**
 * This UI is coded with a few assumptions, which should always be true, this comments serves as a future reference
 * purpose.
 *
 * 1. Tick trade will not have barrier, unless it's a digit trade, reason is that the duration is too short.
 * 2. Barriers value are interpreted differently depends on the duration input, if the contract span over 24 hours,
 *    the barrier(s) are interpreted as absolute value, otherwise it is interpreted as relative value, reason being
 *    that transaction happens for the next tick, to prevent some client having a faster feed, thus, having a better
 *    estimation for his bet, we do not allow betting on absolute value, this only apply to intraday contract, because
 *    the value of single tick diminish when contract time is long, we use intraday simply because it's easier for
 *    quants.
 * 3. ticks is always within 5 to 10
 * 4. digit trade is always ticks only
 * 5. barriers are non available for contract below 2 minutes
 * 6. For underlying that's under our control, we allow relative and absolute barrier regardless of intraday or not
 * 7. Relative barrier is always allowed
 * 8. Forward starting do not have barriers
 * 9. All underlying have risefall trade
 *
 * possibly a better approach would be notify user for wrong info instead of change to correct value automatically,
 * default may not be a good idea at all as client might always want to input value
 */

const errorToShow = errorObj => {
    const { barrierError, contractError, durationError, proposalError, purchaseError, stakeError } = errorObj;

    if (contractError) return contractError;
    if (barrierError) return barrierError;
    if (durationError) return durationError;
    if (stakeError) return stakeError;
    if (proposalError) return proposalError;
    if (purchaseError) return purchaseError;
    return errorObj.other;
};

export default class TradeParams extends PureComponent {

    static defaultProps = {
        type: 'full',
    };

    static propTypes = {
        currency: PropTypes.string.isRequired,
        contract: PropTypes.object,
        compact: PropTypes.bool,
        disabled: PropTypes.bool,
        errors: PropTypes.object,
        forceRenderCount: PropTypes.number.isRequired,
        index: PropTypes.number.isRequired,
        onPurchaseHook: PropTypes.func,
        pipSize: PropTypes.number,
        proposal: PropTypes.object,
        purchaseError: PropTypes.string,
        style: PropTypes.object,
        tradeParams: PropTypes.object,
        type: PropTypes.oneOf(['tick', 'full']).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            dynamicKey: props.forceRenderCount,
        };
    }

    /**
     * componentDidUpdate is used instead of componentWillReceiveProps because the onAssetChange depends on updated
     * props, which only accessible after component update
     * it's a mistake here that method to be reuse are coupled with component states
     * TODO: redesign so that side effect are handle elsewhere
     */
    componentWillReceiveProps(newProps) {
        this.setState({ dynamicKey: newProps.forceRenderCount });
        windowResizeEvent();
    }

    componentWillUnmount() {
        // fire action to saga
    }

    onCloseModal = () => {
        const { index } = this.props;
        actions.updateTradeError(index, 'purchaseError', undefined);
    }

    onPurchase = () => {
        const { index, onPurchaseHook, proposal } = this.props;
        actions.reqPurchase(index, proposal.ask_price, onPurchaseHook);
    }


    // TODO: create an action that update all at once
    clearTradeError = () => {
        const { index } = this.props;
        actions.clearTradeError(index);
    }

    repaintSelf = () => {
        const { dynamicKey } = this.state;
        this.setState({ dynamicKey: dynamicKey + 1 });
    }

    render() {
        const {
            contract,
            currency,
            disabled,
            errors,
            index,
            pipSize,
            proposal,
            style,
            tradeParams,
        } = this.props;

        /**
         * Race condition happen when contract is updated before tradeCategory (async)
         * thus we need to check if the tradeCategory is valid, if not valid simply use the 1st valid category
         */
        const selectedCategory = tradeParams.tradeCategory;
        const selectedType = tradeParams.type;
        const selectedTypeTradingOptions = contract[selectedCategory][selectedType];
        const barrierInfo = selectedTypeTradingOptions && selectedTypeTradingOptions.barriers;  // TODO: rename, this sucks

        let expiryType;
        switch (tradeParams.durationUnit) {
            case 't':
                expiryType = 'tick';
                break;
            case 's':
            case 'm':
            case 'h':
                expiryType = 'intraday';
                break;
            case 'd':
                expiryType = 'daily';
                break;
            default: throw new Error(`Invalid duration unit: ${tradeParams.durationUnit}`);
        }

        const showBarrier = selectedCategory !== 'spreads' &&
            selectedCategory !== 'risefall' &&
            selectedCategory !== 'digits' &&
            selectedCategory !== 'asian' &&
            !tradeParams.dateStart;


        const payout = proposal && proposal.payout;

        const showDuration = !!tradeParams.duration;
        const isDigitType = selectedCategory === 'digits';

        const showSpreadBarrier = selectedCategory === 'spreads';

        const digitOptions = (isDigitType && barrierInfo) && barrierInfo.tick[0].values;
        const askPrice = askPriceFromProposal(proposal);

        const errorText = errorToShow(errors);
        return (
            <div className="trade-params" key={this.state.dynamicKey} style={style}>
                <Modal shown={!!errors.purchaseError} onClose={this.onCloseModal}>
                    <Error text={errors.purchaseError} />
                </Modal>
                <Error text={errorText} />
                <AssetPickerDropDown
                    index={index}
                    selectedSymbol={tradeParams.symbol}
                    selectedSymbolName={tradeParams.symbolName}
                />
                <TradeTypeDropDown
                    index={index}
                    contract={contract}
                    tradeParams={tradeParams}
                />
                {isDigitType &&
                    <DigitBarrierCard
                        barrier={+tradeParams.barrier}
                        digitOptions={digitOptions}
                        index={index}
                    />
                }
                {showBarrier &&
                    <BarrierCard
                        barrier={tradeParams.barrier}
                        barrier2={tradeParams.barrier2}
                        barrierInfo={barrierInfo}
                        barrierType={tradeParams.barrierType}
                        expiryType={expiryType}
                        index={index}
                        pipSize={pipSize}
                        spot={proposal && +proposal.spot}
                    />
                }
                {showDuration && !showSpreadBarrier &&
                    <DurationCard
                        dateStart={tradeParams.dateStart}
                        duration={+tradeParams.duration}
                        durationUnit={tradeParams.durationUnit}
                        forwardStartingDuration={selectedTypeTradingOptions.forwardStartingDuration}
                        options={selectedTypeTradingOptions.durations}
                        index={index}
                    />
                }
                {showDuration && !showSpreadBarrier && selectedTypeTradingOptions.forwardStartingDuration &&
                    <ForwardStartingOptions
                        dateStart={tradeParams.dateStart}
                        forwardStartingDuration={selectedTypeTradingOptions.forwardStartingDuration}
                        startLaterOnly={!selectedTypeTradingOptions.durations}
                        index={index}
                    />
                }
                {!showSpreadBarrier &&
                    <StakeCard
                        amount={+tradeParams.amount}
                        isVirtual={false}
                        index={index}
                    />
                }
                <PayoutCard
                    stake={askPrice}
                    payout={+payout}
                    currency={currency}
                />
                <BuyButton
                    askPrice={askPrice}
                    currency={currency}
                    disabled={disabled}
                    longcode={proposal && proposal.longcode}
                    onClick={this.onPurchase}
                />
            </div>
        );
    }
}
