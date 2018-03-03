import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';

class MatchAuthenticated extends Component {
    static props = {
        component: PropTypes.any.isRequired,
        path: PropTypes.string.isRequired,
        exact: PropTypes.bool,
        isAuthenticated: PropTypes.bool.isRequired,
        willAuthenticate: PropTypes.bool.isRequired,
    }

    render() {
        const {exact, path, isAuthenticated, willAuthenticate, component: Comp} = this.props
        return (
            <Route
                exact={exact}
                path={path}
                render={(props) => {
                    if (isAuthenticated) {
                        return <Comp {...props} />;
                    }
                    if (willAuthenticate) {
                        return null;
                    }
                    if (!willAuthenticate && !isAuthenticated) {
                        return <Redirect to={{pathname: '/login'}}/>;
                    }
                    return null;
                }}
            />)
    }
}

export default MatchAuthenticated;