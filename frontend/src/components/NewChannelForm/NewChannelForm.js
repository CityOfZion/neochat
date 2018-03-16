import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";

const NewChannelForm = ({ handleSubmit, submitting, onSubmit }) => (
  <form onSubmit={handleSubmit(data => onSubmit(data))}>
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
          {submitting ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  </form>
);

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
  }
  return errors;
};

NewChannelForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

export default reduxForm({
  form: "newChannel",
  validate
})(NewChannelForm);
