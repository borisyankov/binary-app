import React, { PureComponent } from 'react';
import { askPriceFromProposal, windowResizeEvent } from 'binary-utils';
import { ServerErrorMsg, ErrorMsg } from 'binary-components';
import classnames from 'classnames';
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

const errorKeys = [
    'contractError',
    'barrierError',
    'durationError',
    'stakeError',
    'proposalError',
    'purchaseError',
    'other',
];

const errorToShow = errorObj => errorObj[errorKeys.find(x => errorObj[x])];

const expirtyTypeFromDurationUnit = durationUnit =>
    ({
        t: 'tick',
        s: 'intraday',
        m: 'intraday',
        h: 'intraday',
        d: 'daily',
    }[durationUnit]);

const categoryHasBarrier = category =>
    category !== 'spreads' &&
    category !== 'risefall' &&
    category !== 'digits' &&
    category !== 'asian';

type Props = {
    currency: string,
    contract: Contract,
    disabled: boolean,
    errors: Object,
    forceRenderCount: number,
    index: number,
    pipSize: number,
    proposal: Object,
    style: Object,
    tradeParams: Object,
};

export default class TradeParams extends PureComponent {
    static defaultProps = {
        forceRenderCount: -1,
    };

    props: Props;

    constructor(props: Props) {
        super(props);

        this.state = {
            dynamicKey: props.forceRenderCount,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({ dynamicKey: newProps.forceRenderCount });
        windowResizeEvent();
    }

    onCloseModal = () => {
        const { index } = this.props;
        actions.updateTradeError(index, 'purchaseError', undefined);
    };

    onPurchase = () => {
        const { index, proposal } = this.props;

        this.setState({ purchasing: true });

        actions.reqPurchase(index, proposal.ask_price, () => {
            this.setState({ purchasing: false });
        });
    };

    clearTradeError = () => {
        const { index } = this.props;
        actions.clearTradeError(index);
    };

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

        const selectedCategory = tradeParams.get('tradeCategory');
        const selectedType = tradeParams.get('type');
        const selectedTypeTradingOptions =
            contract[selectedCategory][selectedType];
        const barrierInfo =
            selectedTypeTradingOptions && selectedTypeTradingOptions.barriers; // TODO: rename, this sucks
        const expiryType = expirtyTypeFromDurationUnit(
            tradeParams.get('durationUnit'),
        );
        const showBarrier =
            categoryHasBarrier(selectedCategory) &&
            !tradeParams.get('dateStart');

        const payout = proposal && proposal.payout;

        const showDuration = !!tradeParams.get('duration');
        const isDigitType = selectedCategory === 'digits';

        const showSpreadBarrier = selectedCategory === 'spreads';

        const digitOptions =
            isDigitType && barrierInfo && barrierInfo.tick[0].values;
        const askPrice = askPriceFromProposal(proposal);
        const longcode = proposal && proposal.longcode;
        const serverError = errors && errors.get('serverError');
        const nonServerError = errors && errorToShow(errors.toJS());

        const { purchasing } = this.state;
        const className = purchasing
            ? classnames('trade-params', 'greyout')
            : 'trade-params';

        return (
            <div
                id={`trade-param${index}`}
                className={className}
                key={this.state.dynamicKey}
                style={style}
            >
                {serverError
                    ? <ServerErrorMsg text={serverError} />
                    : <ErrorMsg text={nonServerError} />}
                <AssetPickerDropDown
                    index={index}
                    selectedSymbol={tradeParams.get('symbol')}
                    selectedSymbolName={tradeParams.get('symbolName')}
                />
                <TradeTypeDropDown
                    index={index}
                    contract={contract}
                    tradeParams={tradeParams.toJS()}
                />
                {isDigitType &&
                    <DigitBarrierCard
                        barrier={+tradeParams.get('barrier')}
                        digitOptions={digitOptions}
                        index={index}
                    />}
                {showBarrier &&
                    <BarrierCard
                        barrier={tradeParams.get('barrier')}
                        barrier2={tradeParams.get('barrier2')}
                        barrierInfo={barrierInfo}
                        barrierType={tradeParams.get('barrierType')}
                        expiryType={expiryType}
                        index={index}
                        pipSize={pipSize}
                        spot={proposal && +proposal.spot}
                    />}
                {showDuration &&
                    !showSpreadBarrier &&
                    <DurationCard
                        dateStart={tradeParams.get('dateStart')}
                        duration={+tradeParams.get('duration')}
                        durationUnit={tradeParams.get('durationUnit')}
                        forwardStartingDuration={
                            selectedTypeTradingOptions.forwardStartingDuration
                        }
                        options={selectedTypeTradingOptions.durations}
                        index={index}
                    />}
                {showDuration &&
                    !showSpreadBarrier &&
                    selectedTypeTradingOptions.forwardStartingDuration &&
                    <ForwardStartingOptions
                        dateStart={tradeParams.get('dateStart')}
                        forwardStartingDuration={
                            selectedTypeTradingOptions.forwardStartingDuration
                        }
                        startLaterOnly={!selectedTypeTradingOptions.durations}
                        index={index}
                    />}
                {!showSpreadBarrier &&
                    <StakeCard
                        amount={+tradeParams.get('amount')}
                        isVirtual={false}
                        index={index}
                    />}
                <PayoutCard
                    stake={askPrice}
                    payout={+payout}
                    currency={currency}
                />
                <BuyButton
                    askPrice={askPrice}
                    currency={currency}
                    disabled={disabled}
                    longcode={longcode}
                    onClick={this.onPurchase}
                />
            </div>
        );
    }
}
