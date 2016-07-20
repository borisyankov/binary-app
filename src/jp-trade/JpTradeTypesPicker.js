import React, { Component } from 'react';
import TabList from 'binary-components/lib/TabList';
import Tab from 'binary-components/lib/Tab';

export default class JpTradeTypesPicker extends Component {

    render() {
        return (
            <TabList>
                <Tab text="Higher/Lower" />
                <Tab text="Touch/No Touch" />
                <Tab text="Ends In/Out" />
                <Tab text="Stays In/Goes Out" />
            </TabList>
        );
    }
}
