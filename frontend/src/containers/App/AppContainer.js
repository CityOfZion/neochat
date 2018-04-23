import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  HomeContainer,
  NotFoundContainer,
  LoginContainer,
  SignupContainer,
  ChannelContainer,
  DirectMessageAddContainer
} from "containers";
import { RedirectAuthenticated, MatchAuthenticated, Sidebar } from "components";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./AppContainer.css";

import { authenticate, unauthenticate, logout } from "../../actions/session";

class AppContainer extends Component {
  static propTypes = {
    authenticate: PropTypes.func.isRequired,
    unauthenticate: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    willAuthenticate: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    currentUserChannels: PropTypes.array.isRequired,
    currentUserDirectMessageChannels: PropTypes.array.isRequired,
    channels: PropTypes.any.isRequired,
    currentUser: PropTypes.shape({ username: PropTypes.string })
  };

  static defaultProps = {
    currentUser: { username: "" }
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.props.authenticate();
    } else {
      this.props.unauthenticate();
    }
  }

  handleLogout = history => this.props.logout({ history });

  render() {
    return (
      <Router>
        <div className="root">
          <Sidebar
            router={this.context.router}
            currentUserChannels={this.props.currentUserChannels}
            channels={this.props.channels}
            direct_messages={this.props.currentUserDirectMessageChannels}
            onLogoutClick={this.handleLogout}
            username={this.props.currentUser.username}
          />
          <Switch>
            <MatchAuthenticated
              exact
              path="/"
              component={HomeContainer}
              isAuthenticated={this.props.isAuthenticated}
              willAuthenticate={this.props.willAuthenticate}
            />
            <MatchAuthenticated
              exact
              path="/direct_messages"
              component={DirectMessageAddContainer}
              isAuthenticated={this.props.isAuthenticated}
              willAuthenticate={this.props.willAuthenticate}
            />
            <RedirectAuthenticated
              path="/login"
              component={LoginContainer}
              isAuthenticated={this.props.isAuthenticated}
              willAuthenticate={this.props.willAuthenticate}
            />
            <RedirectAuthenticated
              path="/signup"
              component={SignupContainer}
              isAuthenticated={this.props.isAuthenticated}
              willAuthenticate={this.props.willAuthenticate}
            />
            <MatchAuthenticated
              path="/channel/:id"
              component={ChannelContainer}
              isAuthenticated={this.props.isAuthenticated}
              willAuthenticate={this.props.willAuthenticate}
            />
            <Route component={NotFoundContainer} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect(
  state => ({
    isAuthenticated: state.session.isAuthenticated,
    willAuthenticate: state.session.willAuthenticate,
    currentUserChannels: state.channels.currentUserChannels,
    channels: state.channels.channels,
    currentUserDirectMessageChannels:
      state.direct_messages.currentUserDirectMessageChannels,
    currentUser: state.session.currentUser
  }),
  { authenticate, unauthenticate, logout }
)(AppContainer);
