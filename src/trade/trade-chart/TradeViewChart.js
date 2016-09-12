import React, { PureComponent, PropTypes } from 'react';
import { BinaryChart } from 'binary-charts';
import {
    internalTradeModelToChartTradeModel,
    serverContractModelToChartContractModel,
} from '../adapters/TradeObjectAdapter';
import { chartApi } from '../../_data/LiveData';
import { mergeTicks } from '../../_reducers/TickReducer';
import { mergeCandles } from '../../_reducers/OHLCReducer';

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
        tradingTime: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            dataType: 'ticks',
            chartType: 'area',
            ticks: [],
            candles: [],
        };

        this.api = chartApi[props.index];

        this.api.events.on('tick', data => {
            const old = this.state.ticks;
            const newTick = {
                epoch: +data.tick.epoch,
                quote: +data.tick.quote,
            };
            this.setState({ ticks: old.concat([newTick]) });
        });

        this.api.events.on('ohlc', data => {
            const ohlc = data.ohlc;
            const newOHLC = {
                epoch: +(ohlc.open_time || ohlc.epoch),
                open: +ohlc.open,
                high: +ohlc.high,
                low: +ohlc.low,
                close: +ohlc.close,
            };
            const old = this.state.candles;
            this.setState({ candles: old.concat([newOHLC]) });
        });
    }

    componentWillMount() {
        this.subscribeToTicks();
        this.subscribeToOHLC();
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

    updateData = (data, type) => {
        if (type === 'ticks') {
            const { times, prices } = data.history;
            const newTicks = times.map((t, idx) => {
                const quote = prices[idx];
                return { epoch: +t, quote: +quote };
            });

            const ticks = mergeTicks(this.state.ticks, newTicks);
            this.setState({ ticks });
            return ticks;
        }

        const candles = mergeCandles(this.state.candles, data.candles);
        this.setState({ candles });
        return candles;
    }

    fetchInBatches = (start, end, type, interval) => {
        const { tradeForChart } = this.props;
        const { symbol } = tradeForChart;
        const count = type === 'ticks' ? 1000 : 500;
        const result = this.api
            .getTickHistory(symbol, { count, end, style: type, granularity: interval })
            .then(r => this.updateData(r, type));

        return result;
    }

    subscribeToTicks = (count = 2000) => {
        const { tradeForChart } = this.props;
        const { symbol } = tradeForChart;
        return this.api
            .getTickHistory(symbol, { count, end: 'latest', subscribe: 1 })
            .then(r => this.updateData(r, 'ticks'));
    }

    subscribeToOHLC = (count = 500, interval = 60) => {
        const { tradeForChart } = this.props;
        const { symbol } = tradeForChart;
        return this.api
            .getTickHistory(symbol, { count, end: 'latest', subscribe: 1, style: 'candles', granularity: interval })
            .then(r => this.updateData(r, 'candles'));
    }

    changeChartType = (type: ChartType) => {
        const { contractForChart, feedLicense } = this.props;
        const { chartType } = this.state;

        // TODO: provide a switch to disable type change control
        if (feedLicense === 'chartonly' || contractForChart || chartType === type) {
            return;
        }

        const newDataType = chartToDataType[type];
        if (newDataType === this.state.dataType) {
            this.setState({ chartType: type });
            return;
        }

        this.setState({ chartType: type, dataType: newDataType });
    }

    // changeChartInterval = (interval: number) => {
    //     const { symbol } = this.props.tradeForChart;
    //     const nowEpoch = nowAsEpoch();
    //     return api.getTickHistory(symbol, {
    //         end: nowEpoch,
    //         start: nowEpoch - duration,
    //         granularity: interval,
    //         style: 'candles',
    //     }).then(r => {
    //         this.setState({ chartType: 'candlestick', dataType: 'candles' });
    //         return r;
    //     });
    // }

    render() {
        const { contractForChart, index, events,
            feedLicense, pipSize, tradeForChart, tradingTime } = this.props;
        const { theme } = this.context;
        const { chartType, ticks, dataType } = this.state;

        return (
            <BinaryChart
                id={`trade-chart${index}`}
                className="trade-chart"
                contract={contractForChart && serverContractModelToChartContractModel(contractForChart)}
                events={events}
                noData={feedLicense === 'chartonly'}
                pipSize={pipSize}
                shiftMode={contractForChart ? 'dynamic' : 'fixed'}
                symbol={tradeForChart && tradeForChart.symbolName}
                ticks={contractForChart ? ticks : this.state[dataType]}
                theme={theme}
                type={contractForChart ? 'area' : chartType}
                trade={tradeForChart && internalTradeModelToChartTradeModel(tradeForChart)}
                tradingTimes={tradingTime.times}
                getData={contractForChart ? undefined : this.fetchInBatches}
                onTypeChange={contractForChart ? undefined : this.changeChartType}   // do not allow change type when there's contract
            />
        );
    }
}
