import React, { PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Star extends React.Component {

    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
		on: PropTypes.bool.isRequired,
	};

    render() {
        const { on } = this.props;
        const imgFile = on ? 'img/star-on.svg' : 'img/star-off.svg';
        return <img style={{ width: '1rem' }} src={imgFile} />;
    }
}
