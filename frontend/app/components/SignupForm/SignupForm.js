import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {Link} from 'react-router-dom';
import {Input} from 'components';
import {card} from './styles.css';

class SignupForm extends Component {
    static props = {
        onSubmit: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        submitting: PropTypes.bool.isRequired,
    }

    handleSubmit = data => this.props.onSubmit(data);

    render() {
        const {handleSubmit, submitting} = this.props;

        return (
            <form
                className={card}
                onSubmit={handleSubmit(this.handleSubmit)}
            >
                <h3 style={{marginBottom: '2rem', textAlign: 'center'}}>Create an account</h3>
                <Field
                    name="username"
                    type="text"
                    component={Input}
                    placeholder="Username"
                    className="form-control"
                />
                <Field
                    name="email"
                    type="email"
                    component={Input}
                    placeholder="Email"
                    className="form-control"
                />
                <Field
                    name="password"
                    type="password"
                    component={Input}
                    placeholder="Password"
                    className="form-control"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-block btn-primary"
                >
                    {submitting ? 'Submitting...' : 'Sign up'}
                </button>
                <hr style={{margin: '2rem 0'}}/>
                <Link to="/login" className="btn btn-block btn-secondary">
                    Login to your account
                </Link>
            </form>
        );
    }
}

const validate = (values) => {
    const errors = {};
    if (!values.username) {
        errors.username = 'Required';
    }
    if (!values.email) {
        errors.email = 'Required';
    }
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 6) {
        errors.password = 'Minimum of 6 characters';
    }
    return errors;
};

export default reduxForm({
    form: 'signup',
    validate,
})(SignupForm);