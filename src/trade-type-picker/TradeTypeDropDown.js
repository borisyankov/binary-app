import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import tradeToFriendlyType from 'binary-utils/lib/tradeToFriendlyType';
import DropDown from '../containers/DropDown';
import TradeTypePicker from './TradeTypePicker';

export default class TradeTypeDropDown extends Component {

    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        compact: PropTypes.bool,
        trade: PropTypes.object.isRequired,
    };

    static contextTypes = {
        router: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            dropdownShown: false,
        };
    }

    render() {
        const { trade } = this.props;
        const selectedType = trade.type;
        const { dropdownShown } = this.state;

        return (
            <div>
                <DropDown
                    shown={dropdownShown}
                    onClose={() => this.setState({ dropdownShown: false })}
                >
                    <TradeTypePicker
                        {...this.props}
                        onSelect={() => this.setState({ dropdownShown: false })}
                    />
                </DropDown>
                <div
                    className="picker-label"
                    onMouseDown={() => this.setState({ dropdownShown: true })}
                >
                    Trade type: {tradeToFriendlyType(selectedType)}
                </div>
            </div>
        );
    }
}
