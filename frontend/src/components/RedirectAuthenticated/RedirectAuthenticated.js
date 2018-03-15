import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';

class RedirectAuthenticated extends Component {
    static propTypes = {
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
                        return <Redirect to={{pathname: '/'}}/>;
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
        )
    }

}

export default RedirectAuthenticated;
