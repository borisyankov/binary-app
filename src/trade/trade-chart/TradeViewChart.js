import React, { PureComponent, PropTypes } from 'react';
import { BinaryChart } from 'binary-charts';
import { actions } from '../../_store';
import {
    internalTradeModelToChartTradeModel,
    serverContractModelToChartContractModel,
} from '../adapters/TradeObjectAdapter';

const zoomToLatest = (ev, chart) => {
    const { dataMax, dataMin } = chart.xAxis[0].getExtremes();
    const half = (dataMax - dataMin) * 0.5 + dataMin;
    chart.xAxis[0].setExtremes(half, dataMax);
};

const chartToDataType = {
    area: 'ticks',
    line: 'ticks',
    candlestick: 'candles',
    ohlc: 'candles',
};

export default class TradeViewChart extends PureComponent {

    static contextTypes = {
        theme: PropTypes.string,
    };

    static propTypes = {
        contractForChart: PropTypes.object,
        ticks: PropTypes.array.isRequired,
        ohlc: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        events: PropTypes.array.isRequired,
        feedLicense: PropTypes.string.isRequired,
        pipSize: PropTypes.number,
        tradeForChart: PropTypes.object,
        tradingTime: PropTypes.object.isRequired,
    };

    static defaultProps = {
        type: 'full',
        feedLicense: '',
        events: [{
            type: 'zoom-to-latest',
            handler: zoomToLatest,
        }],
        ticks: [],
        ohlc: [],
        tradingTime: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            dataType: 'ticks',
            chartType: 'area',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (
            (this.props.tradeForChart && nextProps.tradeForChart) &&
            (this.props.tradeForChart.symbol !== nextProps.tradeForChart.symbol)
        ) {
            this.setState({
                dataType: 'ticks',
                chartType: 'area',
            });
        }
    }

    onRangeChange = () =>
        (count, type) =>
            actions.getDataForSymbol(
                this.props.tradeForChart.symbol,
                count,
                type,
                this.state.dataType,
            );


    changeChartType = (type: ChartType) => {
        const { tradeForChart, contractForChart, feedLicense } = this.props;
        const { chartType } = this.state;

        // do nothing if there' no license for chart data or it's showing a contract
        if (feedLicense === 'chartonly' || contractForChart || chartType === type) {
            return undefined;
        }

        const newDataType = chartToDataType[type];
        if (newDataType === this.state.dataType) {
            this.setState({ chartType: type });
            return undefined;
        }

        this.setState({ chartType: type, dataType: newDataType });
        const dataResult = actions
            .getDataForSymbol(tradeForChart.symbol, 60 * 60, newDataType, true)
            .catch(err => {
                const serverError = err.error.error;
                if (serverError.code === 'NoRealtimeQuotes' || serverError.code === 'MarketIsClosed') {
                    return actions.getDataForSymbol(tradeForChart.symbol, 1, 'hour', newDataType, false);
                }
                throw new Error(`Fetch data failed: ${serverError.message}`);
            });
        return dataResult;
    }

    render() {
        const { contractForChart, index, ticks, ohlc, events,
            feedLicense, pipSize, tradeForChart, tradingTime } = this.props;
        const { theme } = this.context;
        const { chartType, dataType } = this.state;

        return (
            <BinaryChart
                id={`trade-chart${index}`}
                className="trade-chart"
                contract={contractForChart && serverContractModelToChartContractModel(contractForChart)}
                defaultRange={1} // TODO: figure out how to set this dynamically so it looks good despite of data size
                events={events}
                noData={feedLicense === 'chartonly'}
                pipSize={pipSize}
                shiftMode={contractForChart ? 'dynamic' : 'fixed'}
                symbol={tradeForChart && tradeForChart.symbolName}
                ticks={(dataType === 'ticks' || contractForChart) ? ticks : ohlc}
                theme={theme}
                type={contractForChart ? 'area' : chartType}
                trade={tradeForChart && internalTradeModelToChartTradeModel(tradeForChart)}
                tradingTimes={tradingTime.times}
                onRangeChange={contractForChart ? undefined : this.onRangeChange()}
                onTypeChange={contractForChart ? undefined : this.changeChartType}   // do not allow change type when there's contract
            />
        );
    }
}
