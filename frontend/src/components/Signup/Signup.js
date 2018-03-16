import React from "react";
import { SignupForm, Navbar } from "components";
import PropTypes from "prop-types";

const Signup = props => (
  <div style={{ flex: "1" }}>
    <Navbar />
    <SignupForm onSubmit={props.handleSignup} />
  </div>
);

Signup.propTypes = {
  handleSignup: PropTypes.func.isRequired
};

export default Signup;
