import React, { PropTypes } from 'react';
import EChart from './EChart';
import SizeProvider from '../_common/SizeProvider';
import createOptions from './options/MobileChartOptions';

const theme = {
    background: 'white',
    line: 'rgba(42, 48, 82, 0.8)',
    fill: 'rgba(42, 48, 82, 0.2)',
    text: '#999',
    grid: '#eee',
    axisText: 'rgba(64, 68, 72, .5)',
};

export default class TradeChart extends React.Component {

    static propTypes = {
        history: PropTypes.array.isRequired,
    };

    render() {
        const { history } = this.props;
        if (history.length === 0) return null;
        const options = createOptions({ history, theme });
        return (
            <SizeProvider style={{ width: '100%', height: '120px' }}>
                <EChart
                    options={options}
                    {...this.props}
                />
            </SizeProvider>
        );
    }
}
