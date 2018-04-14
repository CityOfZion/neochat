import React, { Component } from "react";
import { Channel } from "components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  connectToChannel,
  leaveChannel,
  createMessage
} from "../../actions/channel";

class ChannelsContainer extends Component {
  static propTypes = {
    channels: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.connectToChannel(this.props.socket, this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps", nextProps);
    if (nextProps.phx_channel !== null) {
      return this.props.switchToChannel(nextProps.match.params.id);
    }
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
    }
    if (!this.props.socket && nextProps.socket) {
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.leaveChannel(this.props.phx_channel);
  }

  render() {
    return <Channel {...this.props} />;
  }
}

export default connect(
  state => {
    if (state.channels.currentChannel.id === undefined) {
      return {
        channel: { name: "loading", id: -1 },
        socket: state.session.socket,
        phx_channel: null,
        messages: [],
        userStatus: []
      };
    }
    const channel = state.channels.channels[state.channels.currentChannel.id];
    return {
      channel: state.channels.currentChannel,
      socket: state.session.socket,
      phx_channel: channel.phx_channel,
      messages: channel.messages,
      userStatus: channel.userStatus
    };
  },
  { connectToChannel, leaveChannel, createMessage }
)(ChannelContainer);

// Their is an issue using currentChannel it's not updated if we don't need to reopen sockets.
// Should use the route
