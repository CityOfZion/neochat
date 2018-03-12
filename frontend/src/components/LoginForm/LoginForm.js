import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { Input } from 'components';
import './LoginForm.css';

class LoginForm extends Component {
    static props = {
        onSubmit: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        submitting: PropTypes.bool.isRequired,
    }

    handleSubmit = (data) => this.props.onSubmit(data);

    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <form
                className="card"
                onSubmit={handleSubmit(this.handleSubmit)}
            >
                <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Login to NeoChat</h3>
                <Field name="email" type="text" component={Input} placeholder="Email" />
                <Field name="password" type="password" component={Input} placeholder="Password" />
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-block btn-primary"
                >
                    {submitting ? 'Logging in...' : 'Login'}
                </button>
                <hr style={{ margin: '2rem 0' }} />
                <Link to="/signup" className="btn btn-block btn-secondary">
                    Create a new account
                </Link>
            </form>
        );
    }
}

const validate = (values) => {
    const errors = {};
    if (!values.email) {
        errors.email = 'Required';
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    return errors;
};

export default reduxForm({
    form: 'login',
    validate,
})(LoginForm);
