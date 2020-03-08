import React, { Component } from 'react';
import Lock from 'auth0-lock';
import Da from './i18n_da';
import FeatherIcon from '../featherIcon';

class Login extends Component {
  render() {
    const login = this.props.type === 'login' ? true : false;
    const title = login ? 'Log ind' : 'Opret bruger';
    return (
      <button onClick={this.login} onMouseDown={e => e.preventDefault()} className={this.props.className}>
        {this.props.icon && <FeatherIcon name={this.props.icon} className={this.props.iconClass} />}
        {title}
      </button>
    );
  }
  login = async () => {
    const clientId = '9lN9yuL4dJ6BteKCnhnMC5Qn7gOUtRFG';
    const domain = 'lykkepartiet.eu.auth0.com';
    const options = {
      auth: {
        redirectUrl: window.location.origin + '/auth',
        responseType: 'token',
        params: {
          scope: 'openid email user_metadata profile'
        }
      },
      theme: {
        logo: window.location.origin + '/favicon.png',
        primaryColor: '#AF8751'
      },
      additionalSignUpFields: [
        {
          name: 'firstname',
          placeholder: 'Fornavn'
        },
        {
          name: 'lastname',
          placeholder: 'Efternavn'
        },
        {
          name: 'terms',
          type: 'checkbox',
          placeholder:
            'Jeg accepterer <a style="text-decoration: underline" href="https://lykkepartiet.dk/privacy">Lykkepartiet privatlivspolitik</a>',
          prefill: 'true',
          validator: function(terms) {
            return {
              valid: terms === 'true'
            };
          }
        }
      ],
      closable: false,
      languageDictionary: Da,
      allowForgotPassword: true,
      allowShowPassword: true,
      rememberLastLogin: false,
      initialScreen: this.props.type,
      allowedConnections: ['Username-Password-Authentication', 'facebook']
    };
    if (
      window.location.href !== window.location.origin + '/401' &&
      window.location.href !== window.location.origin + '/404'
    ) {
      window.sessionStorage.redirectUrl = window.location.href;
    }
    const lock = new Lock(clientId, domain, options);
    lock.show(); //show password dialog from Auth0
  };
}

export default Login;
