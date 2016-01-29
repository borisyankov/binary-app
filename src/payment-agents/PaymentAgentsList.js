import React, { PropTypes } from 'react';
import PaymentAgentsItem from './PaymentAgentsItem';
import M from '../_common/M';

export default class PaymentAgentsList extends React.Component {
    static propTypes = {
        paymentAgents: PropTypes.array.isRequired,
    };

    render() {
        const { paymentAgents } = this.props;
        return (
            <table>
                <thead>
                    <tr>
                        <th><M m="Payment Agent" /></th>
                        <th><M m="Commissions" /></th>
                        <th><M m="Banks" /></th>
                    </tr>
                </thead>
                <tbody>
                    { paymentAgents.map(pa => <PaymentAgentsItem key={pa.name} paymentAgent={pa}/>) }
                </tbody>
            </table>
        );
    }
}
