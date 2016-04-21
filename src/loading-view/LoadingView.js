import React, { Component, PropTypes } from 'react';

export default class LoadingView extends Component {
    static propTypes = {
        text: PropTypes.string,
        shown: PropTypes.bool,
    };

    render() {
        const { text, shown } = this.props;
        return (
            <div className="mobile-page" style={shown ? {} : { display: 'none' } }>
                <img className="spinner" src="img/binary-symbol-logo.svg" />
                <p>{text}</p>
            </div>
        );
    }
}
