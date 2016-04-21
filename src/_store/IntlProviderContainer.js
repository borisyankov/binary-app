import React, { PropTypes } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import allTexts from '../_constants/texts';
import locale from '../_constants/languageLocaleMap';

const timeFormats = {
    full: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    },
};

@connect(state => ({ language: state.settings.get('language') }))
export default class IntlProviderContainer extends React.Component {
    static propTypes = {
        language: PropTypes.string.isRequired,
        children: PropTypes.object,
    };

    render() {
        const { language, children } = this.props;
        return (
            <IntlProvider locale={locale(language)} messages={allTexts(language)} formats={{ time: timeFormats }}>
                {children}
            </IntlProvider>
        );
    }
}
