import React, { PureComponent } from 'react';
import { M, Td, P, Button } from 'binary-components';
import { secondsToTimeString } from 'binary-utils';
import TradingStatsCard from './TradingStatsCard';

export default class RealityCheckSummaryCard extends PureComponent {
    props: {
        confirmIntervalUpdate: (e: SyntheticEvent) => void,
        interval: number,
        loginTime: number,
        sessionDuration: number,
        updateInterval: (e: SyntheticEvent) => void,
    };

    onIntervalChange = (e: SyntheticEvent) =>
        this.props.updateInterval(e.target.value);

    render() {
        const {
            confirmIntervalUpdate,
            loginTime,
            sessionDuration,
            interval,
        } = this.props;

        const currentTime = new Date();
        const loginDate = new Date(loginTime * 1000);
        const durationString = secondsToTimeString(sessionDuration);
        return (
            <div>
                <h3>
                    <M m="Reality Check" />
                </h3>
                <table>
                    <tbody>
                        <tr>
                            <Td text="Login Time" />
                            <td>{loginDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <Td text="Current Time" />
                            <td>{currentTime.toUTCString()}</td>
                        </tr>
                        <tr>
                            <Td text="Session Duration" />
                            <td>{durationString}</td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    <M m="Your trading statistic since " />
                    {loginDate.toUTCString()}
                </p>
                <TradingStatsCard {...this.props} />
                <P text="Specify your reality-check interval in minutes" />
                <input
                    type="number"
                    value={Math.round(interval / 60)}
                    onChange={this.onIntervalChange}
                />
                <Button
                    text="Continue Trading"
                    onClick={confirmIntervalUpdate}
                />
            </div>
        );
    }
}
