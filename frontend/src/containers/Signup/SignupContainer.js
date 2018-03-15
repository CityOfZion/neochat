import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Signup } from "components";
import { signup } from "../../actions/session";

const SignupContainer = (props, { router }) => {
  const handleSignup = data => props.signup(data, router);

  return <Signup handleSignup={handleSignup} />;
};

SignupContainer.contextTypes = {
  router: PropTypes.object
};

SignupContainer.propTypes = {
  signup: PropTypes.func.isRequired
};

export default connect(null, { signup })(SignupContainer);
