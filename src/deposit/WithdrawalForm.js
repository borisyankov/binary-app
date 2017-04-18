import React, { PureComponent } from 'react';
import {
    M,
    P,
    Button,
    ErrorMsg,
    InputGroup,
    SelectGroup,
} from 'binary-components';
import { actions } from '../_store';
import Modal from '../containers/Modal';
import { api } from '../_data/LiveData';

export default class WithdrawForm extends PureComponent {
    props: {
        paymentAgent: object,
        currency: string,
        email: string,
    };

    async componentDidMount() {
        const { email } = this.props;
        await api.sendVerificationEmail(email);
    }

    onAmountChange = event =>
        actions.updatePaymentAgentField('withdrawAmount', event.target.value);

    onVerificationCodeChange = event =>
        actions.updatePaymentAgentField('verificationCode', event.target.value);

    selectPaymentAgent = event =>
        actions.updatePaymentAgentField(
            'selectedPaymentAgent',
            event.target.value,
        );

    withdraw = () => actions.updatePaymentAgentField('withdrawClicked', false);

    confirm = () => actions.updatePaymentAgentField('confirmClicked', false);

    tryWithdraw() {
        const { currency, paymentAgent } = this.props;
        const {
            selectedPaymentAgent,
            withdrawAmount,
            verificationCode,
        } = paymentAgent;
        actions.updatePaymentAgentField('withdrawClicked', true);
        actions.withdrawToPaymentAgentDryRun(
            selectedPaymentAgent,
            currency,
            withdrawAmount,
            verificationCode,
        );
    }

    confirmWithdraw = () => {
        const { currency, paymentAgent } = this.props;
        const {
            selectedPaymentAgent,
            withdrawAmount,
            verificationCode,
        } = paymentAgent;
        actions.updatePaymentAgentField('withdrawClicked', false);
        actions.updatePaymentAgentField('confirmClicked', true);
        actions.withdrawToPaymentAgent(
            selectedPaymentAgent,
            currency,
            withdrawAmount,
            verificationCode,
        );
    };

    render() {
        const { currency, paymentAgent } = this.props;
        const {
            paymentAgents,
            withdrawError,
            dryRunError,
            inProgress,
            dryRunFailed,
            withdrawFailed,
            selectedPaymentAgent,
            withdrawClicked,
            withdrawAmount,
            confirmClicked,
        } = paymentAgent;
        const paymentAgentOptions = paymentAgents.map(pa => ({
            value: pa.paymentagent_loginid,
            text: pa.name,
        }));
        const selectedPaymentAgentName = selectedPaymentAgent
            ? paymentAgentOptions.filter(
                  pa => pa.value === selectedPaymentAgent,
              )[0].text
            : paymentAgentOptions[0].text;
        return (
            <div className="startup-content">
                <Modal
                    shown={!inProgress && withdrawClicked}
                    onClose={this.withdraw}
                >
                    {dryRunFailed
                        ? <div>
                              <h3><M m="Withdrawal Failed" /></h3>
                              <p>{dryRunError}</p>
                          </div>
                        : <div>
                              <h3><M m="Confirmation" /></h3>
                              <p>
                                  <M m="Are you sure you want to withdraw" />
                                  <span>
                                      {' '}
                                      {currency}
                                      {' '}
                                      {withdrawAmount}
                                      {' '}
                                      to
                                      {' '}
                                      {selectedPaymentAgentName}
                                      ?
                                      {' '}
                                  </span>
                              </p>
                              <Button
                                  text="Confirm"
                                  onClick={this.confirmWithdraw}
                              />
                          </div>}
                </Modal>
                <Modal
                    shown={!inProgress && confirmClicked}
                    onClose={this.confirm}
                >
                    <h3>
                        {withdrawFailed
                            ? <M m="Withdrawal Failed" />
                            : <M m="Congratulations" />}
                    </h3>
                    {withdrawFailed
                        ? <p>{withdrawError}</p>
                        : <P text="Your withdrawal is success" />}
                </Modal>
                <SelectGroup
                    label="Payment agent"
                    options={paymentAgentOptions}
                    placeholder="Choose a Payment Agent"
                    value={selectedPaymentAgent}
                    onChange={this.selectPaymentAgent}
                />
                <InputGroup
                    label={`Withdraw (${currency})`}
                    placeholder="Amount"
                    type="number"
                    min={0}
                    max={5000}
                    onChange={this.onAmountChange}
                />
                <InputGroup
                    label="Verification Code(check your email)"
                    placeholder="Verification Code"
                    type="text"
                    onChange={this.onVerificationCodeChange}
                />
                <ErrorMsg shown={false} text="" />
                <Button text="Withdraw" onClick={this.tryWithdraw} />
            </div>
        );
    }
}
