import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';


class NewChannelForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        submitting: PropTypes.bool.isRequired,
    }

    handleSubmit = data => this.props.onSubmit(data);

    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <form onSubmit={handleSubmit(this.handleSubmit)}>
                <div className="input-group">
                    <Field
                        name="name"
                        type="text"
                        placeholder="Name"
                        component="input"
                        className="form-control"
                    />
                    <div className="input-group-btn">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

const validate = (values) => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Required';
    }
    return errors;
};

export default reduxForm({
    form: 'newChannel',
    validate,
})(NewChannelForm);