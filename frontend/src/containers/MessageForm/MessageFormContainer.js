import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import "./MessageFormContainer.css";

export const FileField = data => {
  const { input, type } = data;
  delete input.value;

  return (
    <div>
      <label htmlFor={input.name} className="btn button buttonFile">
        +
      </label>
      <input {...input} id={input.name} type={type} className="inputFile" />
    </div>
  );
};

class MessageFormContainer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onFileUpload: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  handleSubmit = data => this.props.onSubmit(data);
  handleFileChange = data => {
    const files = [...data.target.files];
    this.props.onFileUpload(files);
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
          <Field
            name="file"
            type="file"
            component={FileField}
            onChange={this.handleFileChange}
            className="inputFile"
          />
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
  if (!(values.text || values.file)) {
    errors.text = "Required";
  }
  return errors;
};

export default reduxForm({
  form: "newMessage",
  validate
})(MessageFormContainer);
