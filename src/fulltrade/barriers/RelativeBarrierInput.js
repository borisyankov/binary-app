import React, { PropTypes, Component } from 'react';
import { InputGroup, NumberPlain } from '../../_common';

export default class BarrierInput extends Component {
    static propTypes = {
        barrierType: PropTypes.oneOf(['relative', 'absolute']),
        expiryType: PropTypes.oneOf(['intraday', 'daily']),
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        onUnmount: PropTypes.func,
        pipSize: PropTypes.number,
        value: PropTypes.number,
        spot: PropTypes.number,
    };

    render() {
        const { barrierType, expiryType, name, onChange, pipSize, value, spot } = this.props;
        const relativeValue = expiryType === 'daily' ? spot && (value - spot) : value;
        const absoluteValue = expiryType === 'daily' ? value : spot && (value + spot);
        return (
            <div>
                <InputGroup
                    label={name + (barrierType === 'relative' ? ' offset' : '')}
                    type="number"
                    onChange={onChange}
                    value={barrierType === 'relative' ? relativeValue : absoluteValue}
                />
                {(barrierType === 'relative' && absoluteValue) &&
                    <p>Target spot: <NumberPlain value={absoluteValue} digits={pipSize}/> </p>}
            </div>
        );
    }
}
