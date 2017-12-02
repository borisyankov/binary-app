import React, { PureComponent } from 'react';
import { RadioGroup, Button, Legend, P, ServerErrorMsg, ErrorMsg } from 'binary-components';
import { store } from '../_store/persistentStore';
import { setAccountCurrency } from '../_data/LiveData';

export default class SetCurrencyCard extends PureComponent {
  props: {
    account: object,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedCurrency: '',
      progress: false,
      serverError: false,
      hasError: false,
    };
  }

  setCurrency = (e: SyntheticEvent) => {
    this.setState({ selectedCurrency: e.target.value });
  };

  submitCurrency = async () => {
    const currency = this.state.selectedCurrency;
    if (!currency) {
      this.setState({ hasError: true });
    } else {
      try {
        this.setState({
          progress: true,
          serverError: false,
        });
        setAccountCurrency(currency, store);
        // window.location = window.BinaryBoot.baseUrl;
      } catch (e) {
        this.setState({ serverError: e.error.error.message });
      } finally {
        this.setState({
          progress: false,
        });
      }
    }
  }

  render() {
    const { progress, serverError, selectedCurrency, hasError } = this.state;
    const { account } = this.props;
    const currencyOptions = account.available_currencies;

    return (
      <div className="set-currency-card">
        {hasError && <ErrorMsg text="Please select currency" />}
        {serverError && <ServerErrorMsg text={serverError} />}
        <Legend text="Select currency" />
        <P text="Please select the currency of this account:" />
        <RadioGroup options={currencyOptions} value={selectedCurrency} onChange={this.setCurrency} />
        <Button text="Confirm" disabled={progress} onClick={this.submitCurrency} />
      </div>
    );
  }
}
