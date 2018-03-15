import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const MatchAuthenticated = ({
  exact,
  path,
  isAuthenticated,
  willAuthenticate,
  component: Comp
}) => (
  <Route
    exact={exact}
    path={path}
    render={props => {
      if (isAuthenticated) {
        return <Comp {...props} />;
      }
      if (willAuthenticate) {
        return null;
      }
      if (!willAuthenticate && !isAuthenticated) {
        return <Redirect to={{ pathname: "/login" }} />;
      }
      return null;
    }}
  />
);

MatchAuthenticated.propTypes = {
  component: PropTypes.any.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  isAuthenticated: PropTypes.bool.isRequired,
  willAuthenticate: PropTypes.bool.isRequired
};

MatchAuthenticated.defaultProps = {
  exact: false
};

export default MatchAuthenticated;
