import React, { Component } from "react";
import { Channel } from "components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { connectToChannel, createMessage } from "../../actions/channels";

class ChannelContainer extends Component {
  static propTypes = {
    channels: PropTypes.any.isRequired,
    socket: PropTypes.any.isRequired,
    connectToChannel: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.number.isRequired
      }).isRequired
    }).isRequired
  };

  componentDidMount() {
    this.props.connectToChannel(this.props.socket, this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    const nextChannel = nextProps.channels[nextProps.match.params.id];
    if (
      nextProps.match.params.id !== this.props.match.params.id &&
      !nextChannel
    ) {
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
    }
    if (!this.props.socket && nextProps.socket) {
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
    }
  }

  render() {
    const channel = this.props.channels[this.props.match.params.id];
    if (!channel) {
      return "LOADING";
    }
    return <Channel {...channel} createMessage={this.props.createMessage} />;
  }
}

export default connect(
  state => ({
    channels: state.channels.channels,
    socket: state.session.socket
  }),
  { connectToChannel, createMessage }
)(ChannelContainer);

// Their is an issue using currentChannel it's not updated if we don't need to reopen sockets.
// Should use the route
