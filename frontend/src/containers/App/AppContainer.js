import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {authenticate, unauthenticate, logout} from '../../actions/session';
import {
    HomeContainer,
    NotFoundContainer,
    LoginContainer,
    SignupContainer,
    ChannelContainer
} from 'containers'
import {
    RedirectAuthenticated,
    MatchAuthenticated,
    Sidebar,
} from 'components'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import './AppContainer.css'

class AppContainer extends Component {
    static propTypes = {
        authenticate: PropTypes.func.isRequired,
        unauthenticate: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        willAuthenticate: PropTypes.bool.isRequired,
    }


    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            this.props.authenticate();
        } else {
            this.props.unauthenticate();
        }
    }

    handleLogout = router => this.props.logout(router);

    render() {
        return (
            <Router>
                <div className="root">
                    <Sidebar
                        router={this.context.router}
                        channels={this.props.currentUserChannels}
                        onLogoutClick={this.handleLogout}
                        username={this.props.currentUser.username}
                    />
                    <Switch>

                        <MatchAuthenticated exact={true} path="/" component={HomeContainer}
                                            isAuthenticated={this.props.isAuthenticated}
                                            willAuthenticate={this.props.willAuthenticate}/>
                        <RedirectAuthenticated path="/login" component={LoginContainer}
                                               isAuthenticated={this.props.isAuthenticated}
                                               willAuthenticate={this.props.willAuthenticate}/>
                        <RedirectAuthenticated path="/signup" component={SignupContainer}
                                               isAuthenticated={this.props.isAuthenticated}
                                               willAuthenticate={this.props.willAuthenticate}/>
                        <MatchAuthenticated path="/channel/:id" component={ChannelContainer}
                                            isAuthenticated={this.props.isAuthenticated}
                                            willAuthenticate={this.props.willAuthenticate}/>
                        <Route component={NotFoundContainer}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default connect(
    (state) => ({
        isAuthenticated: state.session.isAuthenticated,
        willAuthenticate: state.session.willAuthenticate,
        currentUserChannels: state.channels.currentUserChannels,
        currentUser: state.session.currentUser
    }),
    {authenticate, unauthenticate, logout}
)(AppContainer);