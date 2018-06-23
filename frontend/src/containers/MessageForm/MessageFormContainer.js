import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { Button, Form, Input, Icon } from "antd";
import "./MessageFormContainer.css";

export const FileField = (data) => {
  const { input, type } = data;
  delete input.value;

  return (
    <span>
      <label htmlFor={input.name} className="btn button buttonFile">
        <Icon type="upload" style={{ fontSize: 26, color: "#08c" }} />
      </label>
      <input {...input} id={input.name} type={type} className="inputFile" />
    </span>
  );
};

class MessageFormContainer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onFileUpload: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  handleSubmit = data => this.props.onSubmit(data);
  handleFileChange = (data) => {
    const files = [...data.target.files];
    this.props.onFileUpload(files);
  };

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <Form
        id="messageForm"
        onSubmit={handleSubmit(this.handleSubmit)}
        className="form"
        layout="inline"
      >
        <Input.Group compact>
          <Field
            name="file"
            type="file"
            component={FileField}
            onChange={this.handleFileChange}
            className="inputFile"
            style={{ width: "5%" }}
          />
          <Field
            component="input"
            name="text"
            type="text"
            style={{ width: "85%" }}
            className="ant-input"
          />
          <Button htmlType="submit" disabled={submitting} className="btn button" style={{ width: "10%" }}>
            Send
          </Button>
        </Input.Group>
      </Form>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!(values.text || values.file)) {
    errors.text = "Required";
  }
  return errors;
};

export default reduxForm({
  form: "newMessage",
  validate,
})(MessageFormContainer);
