import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import RadioGroup from '../fulltrade/workaround/CustomRadioGroup';
import CollapsibleFormSnippet from '../containers/CollapsibleFormSnippet';

export default class DigitBarrierCard extends Component {

    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        barrier: PropTypes.number,
        barrierInfo: PropTypes.object,
        id: PropTypes.string,
        onBarrierChange: PropTypes.func,
    };

    render() {
        const { barrier, barrierInfo, id, onBarrierChange } = this.props;
        return (
            <CollapsibleFormSnippet label="Digits">
                {barrierInfo ?
                    <div>
                        <p>{barrierInfo.name}</p>
                        <RadioGroup
                            name={'digit-selections' + id}
                            options={barrierInfo.values.map(b => ({ text: b, value: b }))}
                            value={barrier}
                            onChange={onBarrierChange}
                        />
                    </div> :
                    <div />}
            </CollapsibleFormSnippet>
        );
    }
}
