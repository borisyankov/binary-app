import React, { PureComponent } from 'react';
import { M, Th, NumberColored } from 'binary-components';

const profitInPercentage = (buy, sell) => (sell - buy) / buy * 100;

export default class ContractSoldDetails extends PureComponent {
    props: {
        buyPrice: any,
        soldPrice: number,
        transId: string,
    };

    render() {
        const { buyPrice, soldPrice, transId } = this.props;
        const profit = profitInPercentage(buyPrice, soldPrice);

        return (
            <div>
                <h3><M m="Trade Confirmation" /></h3>
                <div><M m="You have sold the following contract." /></div>
                <table>
                    <thead>
                        <tr>
                            <Th text="Buy Price" />
                            <Th text="Sale Price" />
                            <Th text="Return" />
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{buyPrice}</td>
                            <td>{soldPrice}</td>
                            <td><NumberColored value={profit} />%</td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <M
                        m="Your transaction reference no is {transId}"
                        values={{ transId }}
                    />
                </div>
            </div>
        );
    }
}
