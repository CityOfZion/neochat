import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import Switch from "react-toggle-switch";

class NewChannelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      private: false
    };
  }

  toggleSwitch = () => {
    this.setState(prevState => {
      return {
        private: !prevState.private
      };
    });
  };

  submit = data => {
    data = {
      ...data,
      type: this.state.private === true ? "private" : "public"
    };
    this.props.onSubmit(data);
  };

  render() {
    const { handleSubmit, submitting, onSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(data => this.submit(data))}>
        <div className="input-group">
          <Field
            name="name"
            type="text"
            placeholder="Name"
            component="input"
            className="form-control"
          />
          <div className="input-group-btn">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
        <div className="private-switch">
          {" "}
          <Switch onClick={this.toggleSwitch} on={this.state.private} />{" "}
          {this.state.private === true ? "Private" : "Public"}{" "}
        </div>
      </form>
    );
  }
}

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
