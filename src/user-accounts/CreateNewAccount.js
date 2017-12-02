import React, { PureComponent } from 'react';
import { Th, SelectOptGroup, Button, ErrorMsg, P } from 'binary-components';
import { store } from '../_store/persistentStore';
import { updateUpgradeField } from '../_actions/UpgradeActions';

export default class CreateNewAccount extends PureComponent {
  static contextTypes = {
    router: () => undefined,
  };

  props : {
    upgradeInfo: object,
    markets: any[],
    currencyOptions: object,
    nextAccountTitle: string,
    account: object,
    loginid: string,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected_currency: '',
      currency_error: false,
    };
  }

  onCurrencyChange = (e: SyntheticEvent) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  onRedirectToAccountOpening = () => {
    this.setState({ currency_error: false });
    if (this.props.account.currency && this.props.account.currency !== '') {
      store.dispatch(updateUpgradeField('selected_currency', this.state.selected_currency));
      this.context.router.push('/upgrade');
    } else {
      this.setState({ currency_error: true });
    }
  }

  render() {
    const { upgradeInfo, nextAccountTitle, markets, currencyOptions, loginid } = this.props;
    const { currency_error } = this.state;

    return (
      <div className="create-new-account-card">
        <legend>
          Create New Account
        </legend>
        {upgradeInfo && !upgradeInfo.canUpgrade &&
          <P text="You have created all accounts available to you." />
        }
        {upgradeInfo && upgradeInfo.canUpgrade &&
        <table>
          <thead>
          <tr>
            <Th text="account" />
            <Th text="market" />
            <Th text="currencies" />
            <Th text="action" />
          </tr>
          </thead>
          <tbody>
          <tr>
            <td> {nextAccountTitle} </td>
            <td> {markets} </td>
            <td>
              <SelectOptGroup
                id="selected_currency"
                options={currencyOptions}
                onChange={this.onCurrencyChange}
                defaultValue={currencyOptions[0].value}
              />
            </td>
            <td>
              <Button text="Create" onClick={this.onRedirectToAccountOpening} />
            </td>
          </tr>
          </tbody>
        </table>
        }
        {currency_error && <ErrorMsg text={`Please set the currency for your existing account ${loginid}, in order to create more accounts.`} />}
      </div>
    );
  }
}
