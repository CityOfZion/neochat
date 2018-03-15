import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signup } from '../../actions/session';
import { Signup } from 'components';

class SignupContainer extends Component {
    static contextTypes = {
        router: PropTypes.object,
    }

    static propTypes = {
        signup: PropTypes.func.isRequired,
    }

    handleSignup = (data) => this.props.signup(data, this.context.router);

    render() {
        return (
           <Signup handleSignup={this.handleSignup}/>
        );
    }
}

export default connect(null, { signup })(SignupContainer);
