import React from "react";
import PropTypes from "prop-types";
import { LoginForm, Navbar } from "components";

const Login = ({ handleLogin }) => (
  <div style={{ flex: "1" }}>
    <Navbar />
    <LoginForm onSubmit={handleLogin} />
  </div>
);
Login.propTypes = {
  handleLogin: PropTypes.func.isRequired
};
export default Login;
