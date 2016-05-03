import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import tradeToFriendlyType from 'binary-utils/lib/tradeToFriendlyType';
import DropDown from '../containers/DropDown';
import TradeTypePicker from './TradeTypePicker';

export default class TradeTypeDropDown extends Component {

    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        compact: PropTypes.bool,
        selectedType: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
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
        const { selectedType, onChange } = this.props;
        const { dropdownShown } = this.state;

        return (
            <div>
                <DropDown
                    shown={dropdownShown}
                    onClose={() => this.setState({ dropdownShown: false })}
                >
                    <TradeTypePicker
                        {...this.props}
                        onTypeChange={(...params) => {
                            onChange(...params);
                            this.setState({ dropdownShown: false });
                        }}
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
