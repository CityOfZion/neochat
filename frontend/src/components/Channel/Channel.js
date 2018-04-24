import React, { Component } from "react";
import { ChannelNavbar, MessageList, ChannelUserList } from "components";
import { MessageFormContainer, ChannelOptionContainer } from "containers";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

class Channel extends Component {
  componentDidUpdate() {
    const element = document.getElementById("messageList");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  handleMessageCreate = data => {
    this.props.createMessage(this.props.phx_channel, data);
  };

  handleFileUpload = data => {
    this.props.uploadFile(this.props.phx_channel, data);
  };

  renderChannel = () => (
    <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignContent: "spaceBetween"
        }}
      >
        <div id="messageList" style={{ height: "100%", overflow: "auto" }}>
          <MessageList messages={this.props.messages} />
        </div>
        <div style={{ height: "50px" }}>
          <MessageFormContainer
            onFileUpload={this.handleFileUpload}
            onSubmit={this.handleMessageCreate}
          />
        </div>
      </div>
      <div style={{ width: "250px", textAlign: "left" }}>
        <ChannelUserList userStatus={this.props.userStatus} />
      </div>
    </div>
  );

  render() {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100%" }}>
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div>
            <ChannelNavbar channel={this.props.channel} />
          </div>
          <Router>
            <Switch>
              <Route exact path="/channel/:id" render={this.renderChannel} />
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
  uploadFile: PropTypes.func.isRequired,
  phx_channel: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  userStatus: PropTypes.object.isRequired
};
export default Channel;
