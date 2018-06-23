import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { TextField } from "redux-form-antd";
import { Button, Form, Switch } from "antd";

class NewChannelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      private: false,
    };
  }

  toggleSwitch = (value) => {
    this.setState({ private: value });
  };

  submit = (data) => {
    const params = {
      ...data,
      type: this.state.private === true ? "private" : "public",
    };
    this.props.onSubmit(params);
  };

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <Form layout="inline" onSubmit={handleSubmit(data => this.submit(data))}>
        <Form.Item>
          <Field name="name" component={TextField} placeholder="Name" />
          <Switch checkedChildren="private" unCheckedChildren="public" onChange={this.toggleSwitch} />
          <Button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            htmlType="submit"
          >
            {submitting ? "Saving..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
  }
  return errors;
};

NewChannelForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: "newChannel",
  validate,
})(NewChannelForm);
