import React, { PureComponent } from 'react';
import { Th } from 'binary-components';
import DailyPricesRow from './DailyPricesRow';

export default class DailyPricesTable extends PureComponent {
    props: {
        dailyPrices: any[],
    };

    render() {
        const { dailyPrices } = this.props;

        return (
            <table>
                <thead>
                    <tr>
                        <Th className="textual" text="Date" />
                        <Th className="numeric" text="Open" />
                        <Th className="numeric" text="High" />
                        <Th className="numeric" text="Low" />
                        <Th className="numeric" text="Close" />
                    </tr>
                </thead>
                <tbody>
                    {dailyPrices.map(x => (
                        <DailyPricesRow key={x.date} {...x} />
                    ))}
                </tbody>
            </table>
        );
    }
}
