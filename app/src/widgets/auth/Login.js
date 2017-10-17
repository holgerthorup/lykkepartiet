import React, { Component } from 'react';
import Lock from 'auth0-lock';
import Da from './i18n_da.js';
import FeatherIcon from '../FeatherIcon.js'

class Login extends Component {
  render() {
    const login = this.props.type === 'login' ? true : false;
    const title = login ? "Log ind" : "Opret bruger";
    const icon = this.props.icon
    return (
      <a onClick={this.login} className={this.props.className}>
        {this.props.icon && <FeatherIcon name={this.props.icon} className={this.props.iconClass}/> }
        {title}
      </a>
    );
  }
  login = async() => {
    const clientId = '1SQLoULbKUTpJC0T5zv2ailBYb3Jw51u'
    const domain = 'initiativet.eu.auth0.com'
    const options = {
      auth: {
        redirectUrl: window.location.origin + '/auth',
        responseType: 'token',
        params: {
          scope: 'openid email user_metadata'
        }
      },
      theme: {
        logo: window.location.origin + '/auth_logo.svg',
        primaryColor: '#42BFB4',
      },
      additionalSignUpFields: [{
        name: "firstname",
        placeholder: "Fornavn"
      }, {
        name: "lastname",
        placeholder: "Efternavn"
      }],
      languageDictionary: Da,
      allowForgotPassword: false,
      allowShowPassword: true,
      rememberLastLogin: false,
      initialScreen: this.props.type
    }
    const lock = new Lock (clientId, domain, options)
    lock.show() //show password dialog from Auth0
  }
}

export default Login;
