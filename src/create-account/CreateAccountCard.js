import React, { PureComponent, PropTypes } from 'react';
import { P, Button, Countries, ErrorMsg, InputGroup, LogoSpinner } from 'binary-components';
import { isValidPassword } from 'binary-utils';
import { api } from '../_data/LiveData';
import { actions } from '../_store';
import config from '../config';

export default class CrateAccountCard extends PureComponent {

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            progress: false,
            error: '',
            verificationCode: '',
            password: '',
            confirmPassword: '',
            residence: '',
        };
    }

    onVerificationCodeChange = e =>
        this.setState({ verificationCode: e.target.value });

    onPasswordChange = e =>
        this.setState({ password: e.target.value });

    onConfirmPasswordChange = e =>
        this.setState({ confirmPassword: e.target.value });

    onResidenceChange = e =>
        this.setState({ residence: e.target.value });

    onFormSubmit = e => {
        e.preventDefault();
        this.setState({
            validatedOnce: true,
        });
        if (this.allValid) {
            this.performCreateAccount();
        }
    }

    performCreateAccount = async () => {
        const { password, verificationCode, residence } = this.state;
        actions.removePersonalData();
        try {
            this.setState({
                progress: true,
                serverError: false,
            });
            const response = await api.createVirtualAccount({
                // email,
                verification_code: verificationCode,
                client_password: password,
                residence,
                affiliate_token: config.affiliateToken,
            });
            localStorage.setItem('account', JSON.stringify({ token: response.new_account_virtual.oauth_token }));
            // use react router because we want hash history in mobile
            this.context.router.push('/');
            window.location.reload();
        } catch (error) {
            this.setState({ serverError: error.message });
        } finally {
            this.setState({
                progress: false,
            });
        }
    }

    render() {
        const { verificationCode, password, confirmPassword, residence, validatedOnce, progress, serverError } = this.state;
        const residenceIsValid = !!residence;
        const verificationCodeIsValid = verificationCode.length >= 15;
        const passwordIsValid = isValidPassword(password);
        const passwordsMatch = password === confirmPassword;
        this.allValid = residenceIsValid && verificationCodeIsValid && passwordIsValid && passwordsMatch;
        const { residenceList } = this.props;

        return (
            <div className="startup-content">
                <LogoSpinner spinning={progress} />
                <img className="logo-text" src="img/binary-type-logo.svg" alt="Logo" />
                <P className="notice-msg" text="Thank you for signing up! Check your email to get the verification token." />
                {serverError &&
                    <ErrorMsg text={serverError} />
                }
                <form onSubmit={this.onFormSubmit}>
                    <InputGroup
                        type="text"
                        placeholder="Verification Code"
                        onChange={this.onVerificationCodeChange}
                    />
                    {validatedOnce && !verificationCodeIsValid &&
                        <ErrorMsg text="Enter a valid verification code" />
                    }
                    <fieldset>
                        <Countries onChange={this.onResidenceChange} residenceList={residenceList} />
                    </fieldset>
                    {validatedOnce && !residenceIsValid &&
                        <ErrorMsg text="Choose your country" />
                    }
                    <InputGroup
                        type="password"
                        placeholder="Password"
                        onChange={this.onPasswordChange}
                    />
                    {validatedOnce && !passwordIsValid &&
                        <ErrorMsg text="Password should have lower and uppercase letters and 6 characters or more" />
                    }
                    <InputGroup
                        type="password"
                        placeholder="Confirm Password"
                        onChange={this.onConfirmPasswordChange}
                    />
                    {validatedOnce && !passwordsMatch &&
                        <ErrorMsg text="Passwords do not match" />
                    }
                    <Button disabled={progress || validatedOnce && !this.allValid} text="Continue" />
                </form>
            </div>
        );
    }
}
