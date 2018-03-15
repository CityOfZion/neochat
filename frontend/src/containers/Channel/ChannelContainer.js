import React, { Component } from "react";
import { Channel } from "components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  connectToChannel,
  leaveChannel,
  createMessage
} from "../../actions/channel";

class ChannelContainer extends Component {
  componentDidMount() {
    this.props.connectToChannel(this.props.socket, this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.leaveChannel(this.props.phx_channel);
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
    }
    if (!this.props.socket && nextProps.socket) {
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.leaveChannel(this.props.phx_channel);
  }

  static propTypes = {
    socket: PropTypes.any.isRequired,
    phx_channel: PropTypes.any.isRequired,
    channel: {
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    },
    match: {
      params: {
        id: PropTypes.number.isRequired
      }
    },
    connectToChannel: PropTypes.func.isRequired,
    leaveChannel: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired
  };

  render() {
    return <Channel {...this.props} />;
  }
}

export default connect(
  state => {
    return {
      channel: state.channel.currentChannel,
      socket: state.session.socket,
      phx_channel: state.channel.channel,
      messages: state.channel.messages
    };
  },
  { connectToChannel, leaveChannel, createMessage }
)(ChannelContainer);
