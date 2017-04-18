import React, { PureComponent } from 'react';
import { Th } from 'binary-components';

export default class AssetDetailsTradingEvents extends PureComponent {
    props: {
        events: any[],
    };

    render() {
        const { events } = this.props;

        if (!events) return null;

        return (
            <table>
                <thead>
                    <tr>
                        <Th className="textual" text="Dates" />
                        <Th className="textual" text="Description" />
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, i) => (
                        <tr key={i}>
                            <td className="textual">{event.dates}</td>
                            <td className="textual">{event.descrip}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
