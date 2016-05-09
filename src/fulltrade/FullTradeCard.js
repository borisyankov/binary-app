import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { BinaryChart } from 'binary-charts';
// const BinaryChart = (props) => <div {...props} style={{ background: 'grey' }} />;
import PurchaseFailed from '../_common/PurchaseFailed';
import Modal from '../containers/Modal';
import FullTradeParams from '../trade-params/FullTradeParams';
import ContractReceiptCard from './ContractReceiptCard';
import findDeep from 'binary-utils/lib/findDeep';
import { mockedContract } from './../_constants/MockContract';
import {
    internalTradeModelToServerTradeModel,
    serverContractModelToChartContractModel,
} from './adapters/TradeObjectAdapter';
import shallowEqualDebug from './shallowEqualDebug';

export default class FullTradeCard extends Component {

    // shouldComponentUpdate = shouldPureComponentUpdate;

    static defaultProps = {
        type: 'full',
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        compact: PropTypes.bool,
        currency: PropTypes.string.isRequired,
        contract: PropTypes.object,
        contractBought: PropTypes.object,
        index: PropTypes.number.isRequired,
        marketIsOpen: PropTypes.bool,
        trade: PropTypes.object.isRequired,
        type: PropTypes.oneOf(['tick', 'full']).isRequired,
        ticks: PropTypes.array,
    };

    shouldComponentUpdate(nextProps) {
        return !shallowEqualDebug(this.props, nextProps);
    }

    render() {
        const { actions, index, marketIsOpen, trade, ticks } = this.props;
        const { lastBoughtContract } = trade.purchaseInfo;
        const { symbolName } = trade.params;

        const contract = this.props.contract || mockedContract;

        const contractAllowStartLater = findDeep(contract, child => child && !!child.forwardStartingDuration);

        const disabled =
            contract === mockedContract ||
            trade.uiState.disabled ||
            (!marketIsOpen && !contractAllowStartLater);

        // TODO: remove usage of adapter so we have a consistent model
        const tradeRequiredByChart = internalTradeModelToServerTradeModel(trade.params);
        const contractRequiredByChart = serverContractModelToChartContractModel(lastBoughtContract);

        return (
            <div disabled={disabled} className={'trade-panel'}>
                <Modal
                    shown={!!trade.purchaseInfo.buy_error}
                    onClose={() => actions.updatePurchaseInfo(index, 'buy_error', undefined)}
                >
                    <PurchaseFailed failure={trade.purchaseInfo.buy_error} />
                </Modal>
                <div className="trade-chart-container">
                    <BinaryChart
                        className="trade-chart"
                        contract={contractRequiredByChart}
                        symbol={symbolName}
                        ticks={ticks}
                        trade={tradeRequiredByChart}
                        pipSize={trade.pipSize}
                        rangeChange={(count, type) => actions.getDataForSymbol(trade.symbol, count, type)}
                    />
                </div>
                {lastBoughtContract ?
                    <ContractReceiptCard
                        actions={actions}
                        boughtContract={lastBoughtContract}
                        tradeId={index}
                    /> :
                    <FullTradeParams
                        {...this.props}
                        tradeParams={trade.params}
                        proposalInfo={trade.proposalInfo}
                        pipSize={trade.pipSize}
                        disabled={disabled}
                        contract={contract}
                    />
                }
            </div>
        );
    }
}
