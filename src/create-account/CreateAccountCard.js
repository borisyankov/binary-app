import React, { PureComponent } from 'react';
import {
    Notice,
    Button,
    Countries,
    ErrorMsg,
    ServerErrorMsg,
    InputGroup,
    LogoSpinner,
} from 'binary-components';
import { isValidPassword } from 'binary-utils';
import { api } from '../_data/LiveData';
import storage from '../_store/storage';
import { actions } from '../_store';
import config from '../config';

type Props = {
    residenceList: string[],
};

export default class CrateAccountCard extends PureComponent {
    static contextTypes = {
        router: () => undefined,
    };

    props: Props;

    constructor(props: Props) {
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

    onVerificationCodeChange = (e: SyntheticEvent) =>
        this.setState({ verificationCode: e.target.value });

    onPasswordChange = (e: SyntheticEvent) =>
        this.setState({ password: e.target.value });

    onConfirmPasswordChange = (e: SyntheticEvent) =>
        this.setState({ confirmPassword: e.target.value });

    onResidenceChange = (e: SyntheticEvent) =>
        this.setState({ residence: e.target.value });

    onFormSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        this.setState({
            validatedOnce: true,
        });
        if (this.allValid) {
            this.performCreateAccount();
        }
    };

    performCreateAccount = async () => {
        const {
            password,
            verificationCode,
            residence /* , utm_source, utm_medium, utm_campaign */,
        } = this.state;
        actions.removePersonalData();
        try {
            this.setState({
                progress: true,
                serverError: false,
            });
            const response = await api.createVirtualAccount({
                verification_code: verificationCode,
                client_password: password,
                residence,
                affiliate_token: config.affiliateToken,
                // utm_source,
                // utm_medium,
                // utm_campaign,
            });
            storage.setItem(
                'account',
                JSON.stringify({
                    token: response.new_account_virtual.oauth_token,
                }),
            );
            // use react router because we want hash history in mobile
            this.context.router.push('/');
            window.location.reload();
        } catch (e) {
            this.setState({ serverError: e.error.error.message });
        } finally {
            this.setState({
                progress: false,
            });
        }
    };

    render() {
        const {
            verificationCode,
            password,
            confirmPassword,
            residence,
            validatedOnce,
            progress,
            serverError,
        } = this.state;
        const residenceIsValid = !!residence;
        const verificationCodeIsValid = verificationCode.length >= 15;
        const passwordIsValid = isValidPassword(password);
        const passwordsMatch = password === confirmPassword;
        this.allValid =
            residenceIsValid &&
            verificationCodeIsValid &&
            passwordIsValid &&
            passwordsMatch;
        const { residenceList } = this.props;

        return (
            <div className="startup-content">
                <LogoSpinner spinning={progress} />
                <img
                    className="logo-text"
                    src="img/binary-type-logo.svg"
                    alt="Logo"
                />
                <Notice text="Thank you for signing up! Check your email to get the verification token." />
                {serverError && <ServerErrorMsg text={serverError} />}
                <form onSubmit={this.onFormSubmit}>
                    <InputGroup
                        type="text"
                        placeholder="Verification Code"
                        onChange={this.onVerificationCodeChange}
                    />
                    {validatedOnce &&
                        !verificationCodeIsValid &&
                        <ErrorMsg text="Enter a valid verification code" />}
                    <fieldset>
                        <Countries
                            onChange={this.onResidenceChange}
                            residenceList={residenceList}
                        />
                    </fieldset>
                    {validatedOnce &&
                        !residenceIsValid &&
                        <ErrorMsg text="Choose your country" />}
                    <InputGroup
                        type="password"
                        placeholder="Password"
                        onChange={this.onPasswordChange}
                    />
                    {validatedOnce &&
                        !passwordIsValid &&
                        <ErrorMsg text="Password should have lower and uppercase letters and 6 characters or more" />}
                    <InputGroup
                        type="password"
                        placeholder="Confirm Password"
                        onChange={this.onConfirmPasswordChange}
                    />
                    {validatedOnce &&
                        !passwordsMatch &&
                        <ErrorMsg text="Passwords do not match" />}
                    <Button
                        disabled={progress || (validatedOnce && !this.allValid)}
                        text="Continue"
                    />
                </form>
            </div>
        );
    }
}
