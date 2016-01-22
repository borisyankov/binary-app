import React, { PropTypes } from 'react';
import PaymentAgentsList from './PaymentAgentsList';
import PaymentAgentWithdrawForm from './PaymentAgentWithdrawForm';
import { Tabs, M } from '../_common';

export default class PaymentAgentsCard extends React.Component {
    static propTypes = {
        paymentAgent: PropTypes.object.isRequired,
        currency: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = { activeTab: 0 };
    }

    render() {
        const { paymentAgent, currency, country } = this.props;
        const paymentAgents = paymentAgent.toJS().paymentAgents;
        const paymentAgentOptions = paymentAgents.map(pa => ({ value: pa.paymentagent_loginid, text: pa.name }));

        const tabs = [
            { text: 'Payment Agents', component: <PaymentAgentsList paymentAgents={paymentAgents} /> },
            { text: 'Withdrawal',
                component: <PaymentAgentWithdrawForm
                    paymentAgentOptions={paymentAgentOptions}
                    currency={currency}
                    {...paymentAgent.toJS()}
                    {...this.props}
                />,
            },
        ];
        return (
            paymentAgents.length === 0 ?
                <div>
                    <M m="Sorry, we have no payment agents in" /> {country}
                </div> :
                <Tabs
                    activeIndex={this.state.activeTab}
                    onChange={idx => this.setState({ activeTab: idx })}
                    id="pa-card"
                    tabs={tabs}
                />
        );
    }
}
