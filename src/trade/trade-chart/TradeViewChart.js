import React, { PureComponent, PropTypes } from 'react';
import { BinaryChart } from 'binary-charts';
import {
    internalTradeModelToChartTradeModel,
    serverContractModelToChartContractModel,
} from '../adapters/TradeObjectAdapter';
import { chartApi } from '../../_data/LiveData';
import { mergeTicks } from '../../_reducers/TickReducer';
import { mergeCandles } from '../../_reducers/OHLCReducer';

const zoomInTo = (ratio) => (ev, chart) => {
    const { dataMax, dataMin } = chart.xAxis[0].getExtremes();
    const range = (dataMax - dataMin) * ratio;
    chart.xAxis[0].setExtremes(dataMax - range, dataMax);
};

const zoomInMax = (ev, chart) => {
    const { dataMax } = chart.xAxis[0].getExtremes();
    const { minRange } = chart.xAxis[0].options;
    chart.xAxis[0].setExtremes(dataMax - minRange, dataMax);
};

const chartToDataType = {
    area: 'ticks',
    line: 'ticks',
    candlestick: 'candles',
    ohlc: 'candles',
};

const defaultState = {
    dataType: 'ticks',
    chartType: 'area',
    ticks: [],
    candles: [],
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
        events: [
            {
                type: 'zoom-in-to',
                handler: zoomInTo(1 / 16),
            },
            {
                type: 'zoom-in-max',
                handler: zoomInMax,
            },
        ],
        tradingTime: {},
    };

    constructor(props) {
        super(props);
        this.state = defaultState;

        this.api = chartApi[props.index];
    }

    componentWillMount() {
        this.api.events.on('tick', data => {
            const { tradeForChart } = this.props;

            // ignored delayed tick from previous subscription
            if (data.tick.symbol !== tradeForChart.symbol) return;

            const old = this.state.ticks;
            const newTick = {
                epoch: +data.tick.epoch,
                quote: +data.tick.quote,
            };
            this.setState({ ticks: old.concat([newTick]) });
            this.ticksId = data.tick.id;
        });
        this.api.events.on('ohlc', data => {
            const { tradeForChart } = this.props;

            // ignore delayed tick from previous subscription
            if (data.ohlc.symbol !== tradeForChart.symbol) return;

            const old = this.state.candles;

            // list of candles might be received later than candles stream due to size
            // do not process single candle that arrived before list of candles
            if (old.length < 3) {
                return;
            }

            const ohlc = data.ohlc;
            const newOHLC = {
                epoch: +(ohlc.open_time || ohlc.epoch),
                open: +ohlc.open,
                high: +ohlc.high,
                low: +ohlc.low,
                close: +ohlc.close,
            };
            const last1 = old[old.length - 1];
            const last2 = old[old.length - 2];
            const last3 = old[old.length - 3];
            const interval = last2.epoch - last3.epoch;
            const diff = newOHLC.epoch - last1.epoch;

            if (diff < interval) {
                const newOHLCArr = old.slice(0, -1);
                newOHLCArr.push(newOHLC);
                this.setState({ candles: newOHLCArr });
            } else {
                this.setState({ candles: old.concat([newOHLC]) });
            }
            this.ohlcId = data.ohlc.id;
        });
    }

    componentDidMount() {
        const { tradeForChart, index } = this.props;
        const { symbol } = tradeForChart;

        this.subscribeToTicks(symbol).then(() => {
            const chartDiv = document.getElementById(`trade-chart${index}`);
            chartDiv.dispatchEvent(new Event('zoom-in-to'));
        });
        this.subscribeToOHLC(symbol);
    }

    componentWillReceiveProps(nextProps) {
        if (
            (this.props.tradeForChart && nextProps.tradeForChart) &&
            (this.props.tradeForChart.symbol !== nextProps.tradeForChart.symbol)
        ) {
            this.setState(defaultState);
            this.unsubscribe();

            this.subscribeToTicks(nextProps.tradeForChart.symbol).then(() => {
                const chartDiv = document.getElementById(`trade-chart${nextProps.index}`);
                chartDiv.dispatchEvent(new Event('zoom-in-to'));
            });
            this.subscribeToOHLC(nextProps.tradeForChart.symbol);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.api.events.ignoreAll('tick');
        this.api.events.ignoreAll('ohlc');
    }

    unsubscribe = () => {
        if (this.ticksId) this.api.unsubscribeByID(this.ticksId);
        if (this.ohlcId) this.api.unsubscribeByID(this.ohlcId);
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

    fetchData = (start, end, type, interval) => {
        const { tradeForChart } = this.props;
        const { symbol } = tradeForChart;
        const count = type === 'ticks' ? 1000 : 500;
        const result = this.api
            .getTickHistory(symbol, { count, end, style: type, granularity: interval })
            .then(r => this.updateData(r, type));

        return result;
    }

    subscribeToTicks = (symbol, count = 2000) =>
        this.api
            .getTickHistory(symbol, { count, end: 'latest', subscribe: 1 })
            .catch(err => {
                const errCode = err.error.error.code;
                if (errCode === 'MarketIsClosed' || errCode === 'NoRealTimeQuotes') {
                    return this.api.getTickHistory(symbol, { count, end: 'latest' });
                }
                throw err;
            })
            .then(r => this.updateData(r, 'ticks'));

    subscribeToOHLC = (symbol, count = 500, interval = 60) =>
        this.api
            .getTickHistory(symbol, { count, end: 'latest', subscribe: 1, style: 'candles', granularity: interval })
            .catch(err => {
                const errCode = err.error.error.code;
                if (errCode === 'MarketIsClosed' || errCode === 'NoRealTimeQuotes') {
                    return this.api.getTickHistory(symbol, { count, end: 'latest', style: 'candles', granularity: interval });
                }
                throw err;
            })
            .then(r => this.updateData(r, 'candles'));

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

    render() {
        const { contractForChart, index, events,
            feedLicense, pipSize, tradeForChart } = this.props;
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
                symbol={tradeForChart && tradeForChart.symbol}
                assetName={tradeForChart && tradeForChart.symbolName}
                ticks={contractForChart ? ticks : this.state[dataType]}
                theme={theme}
                type={contractForChart ? 'area' : chartType}
                trade={tradeForChart && internalTradeModelToChartTradeModel(tradeForChart)}
                // tradingTimes={tradingTime.times}
                getData={contractForChart ? undefined : this.fetchData}
                onTypeChange={contractForChart ? undefined : this.changeChartType}   // do not allow change type when there's contract
            />
        );
    }
}
