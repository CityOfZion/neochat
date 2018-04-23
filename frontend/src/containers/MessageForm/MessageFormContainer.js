import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import "./MessageFormContainer.css";

class MessageFormContainer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  handleSubmit = data => this.props.onSubmit(data);
  handleChange = machin => {
    document.getElementById("messageForm").submit();
  };

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <form
        id="messageForm"
        onSubmit={handleSubmit(this.handleSubmit)}
        className="form"
      >
        <div className="input-group">
          <input
            id="file"
            name="file"
            type="file"
            className="inputFile"
            onChange={this.handleChange}
          />

          <label htmlFor="file" className="btn button buttonFile">
            +
          </label>
          <Field
            name="text"
            type="text"
            component="input"
            className="form-control input"
          />
          <div className="input-group-append input-group-btn">
            <button disabled={submitting} className="btn button">
              Send
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.text) {
    errors.text = "Required";
  }
  return errors;
};

export default reduxForm({
  form: "newMessage",
  validate
})(MessageFormContainer);
