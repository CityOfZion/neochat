import React, { Component } from "react";
import { ChannelNavbar, MessageList } from "components";
import { MessageFormContainer, ChannelOptionContainer } from "containers";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

class Channel extends Component {
  handleMessageCreate = data => {
    this.props.createMessage(this.props.phx_channel, data);
  };

  render() {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100%" }}>
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <ChannelNavbar channel={this.props.channel} />
          <Router>
            <Switch>
              <Route
                exact
                path="/channel/:id"
                render={() => (
                  <div>
                    <MessageList messages={this.props.messages} />
                    <MessageFormContainer onSubmit={this.handleMessageCreate} />
                  </div>
                )}
              />
              <Route
                exact
                path="/channel/:id/options"
                component={ChannelOptionContainer}
              />
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

Channel.propTypes = {
  createMessage: PropTypes.func.isRequired,
  phx_channel: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired
};
export default Channel;
