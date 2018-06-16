import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const RedirectAuthenticated = ({
  exact,
  path,
  isAuthenticated,
  willAuthenticate,
  component: Comp,
}) => (
  <Route
    exact={exact}
    path={path}
    render={(props) => {
      if (isAuthenticated) {
        return <Redirect to={{ pathname: '/' }} />;
      }
      if (willAuthenticate) {
        return null;
      }
      if (!willAuthenticate && !isAuthenticated) {
        return <Comp {...props} />;
      }
      return null;
    }}
  />
);

RedirectAuthenticated.propTypes = {
  component: PropTypes.any.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  isAuthenticated: PropTypes.bool.isRequired,
  willAuthenticate: PropTypes.bool.isRequired,
};

RedirectAuthenticated.defaultProps = {
  exact: false,
};

export default RedirectAuthenticated;
