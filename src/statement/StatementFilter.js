import React, { PureComponent } from 'react';
import { Tab, TabList } from 'binary-components';
import { actions } from '../_store';

export default class StatementFilter extends PureComponent {
    props: {
        transactionsFilter: number,
    };

    onFilterChange = idx => actions.updateTransactionsFilter(idx);

    render() {
        const { transactionsFilter } = this.props;

        return (
            <TabList
                activeIndex={transactionsFilter}
                onChange={this.onFilterChange}
            >
                <Tab text="Today" />
                <Tab text="Yesterday" />
                <Tab text="Last 7 Days" />
                <Tab text="Last 30 Days" />
            </TabList>
        );
    }
}
