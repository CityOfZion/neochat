import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/session';
import {Login} from 'components'

class LoginContainer extends Component {
    static contextTypes = {
        router: PropTypes.object,
    }

    static propTypes = {
        login: PropTypes.func.isRequired,
    }

    handleLogin = (data) => this.props.login(data, this.context.router);

    render() { return(<Login handleLogin={this.handleLogin}/>) }
}

export default connect(null, { login })(LoginContainer);