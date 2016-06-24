import React, { Component, PropTypes } from 'react';
import Button from 'binary-components/lib/Button';
import InputGroup from 'binary-components/lib/InputGroup';
import * as LiveData from '../_data/LiveData';
import isValidPassword from 'binary-utils/lib/isValidPassword';
import ErrorMsg from 'binary-components/lib/ErrorMsg';
import M from 'binary-components/lib/M';

export default class SettingsChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            validatedOnce: false,
            passwordsDontMatch: false,
            passwordNotValid: false,
            successMessage: '',
            errorMessage: '',
        };
    }

    onChangePassword = () => {
        this.setState({
            validatedOnce: true,
            errorMessage: '',
            successMessage: '',
            passwordNotValid: false,
            passwordsDontMatch: false,
        });
        const { currentPassword, newPassword, confirmPassword } = this.state;
        if (isValidPassword(newPassword, confirmPassword)) {
            this.sendRequest({
                old_password: currentPassword,
                new_password: newPassword,
            });
        } else {
            this.setState({ passwordsDontMatch: true });
        }
    }

    async sendRequest(req) {
        try {
            const response = await LiveData.api.changePassword(req);
            if ('error' in response) {
               this.setState({ passwordNotValid: true });
            } else {
                this.setState({ successMessage: 'Password changed successfully.' });
            }
        } catch (e) {
            this.setState({ errorMessage: e.message });
        }
    }

    render() {
        const { validatedOnce, passwordNotValid, passwordsDontMatch, successMessage, errorMessage } = this.state;

        return (
            <div className="settings-change-password">
                <InputGroup
                    placeholder="Current password"
                    type="password"
                    onChange={e => this.setState({ currentPassword: e.target.value })}
                />
                <InputGroup
                    placeholder="New password"
                    type="password"
                    onChange={e => this.setState({ newPassword: e.target.value })}
                />
                <ErrorMsg
                    shown={validatedOnce && passwordNotValid}
                    text="Password should have lower and uppercase letters with numbers, at least 6 characters."
                />
                <InputGroup
                    placeholder="Confirm new password"
                    type="password"
                    onChange={e => this.setState({ confirmPassword: e.target.value })}
                />
                <ErrorMsg
                    shown={validatedOnce && passwordsDontMatch}
                    text="Passwords do not match"
                />
                <Button
                    text="Change Password"
                    onClick={this.onChangePassword}
                />
                <ErrorMsg
                    shown={validatedOnce && !!errorMessage}
                    text={errorMessage}
                />
                {validatedOnce && successMessage &&
                    <p className="successMessage">
                            <M m={successMessage} />
                    </p>
                }
            </div>
        );
    }
}
