import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Login } from "components";
import { login } from "../../actions/session";

class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  handleLogin = data => this.props.login(data, this.context.router);

  render() {
    return <Login handleLogin={this.handleLogin} />;
  }
}

export default connect(null, { login })(LoginContainer);
