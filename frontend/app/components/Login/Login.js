import React, { Component } from 'react';

import { LoginForm, Navbar } from 'components'

class Login extends React.Component {
    render() {
        return (
            <div style={{flex: '1'}}>
                <Navbar/>
                <LoginForm onSubmit={this.props.handleLogin}/>
            </div>
        );
    }
}
export default Login;
