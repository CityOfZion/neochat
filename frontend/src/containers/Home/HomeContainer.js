import React from 'react';
import PropTypes from 'prop-types';
import { Home } from 'components';
import { connect } from 'react-redux';
import { logout } from '../../actions/session';
import {
  fetchChannels,
  createChannel,
  joinChannel,
} from '../../actions/channels';

class HomeContainer extends React.Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    fetchChannels: PropTypes.func.isRequired,
    createChannel: PropTypes.func.isRequired,
    joinChannel: PropTypes.func.isRequired,
    channels: PropTypes.array.isRequired,
    currentUserChannels: PropTypes.array.isRequired,
  };
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    this.props.fetchChannels();
  }

  handleLogout = () => this.props.logout(this.context.router);

  render() {
    const channelProps = {
      fetchChannels: this.props.fetchChannels,
      createChannel: this.props.createChannel,
      joinChannel: this.props.joinChannel,
      channels: this.props.channels,
      currentUserChannels: this.props.currentUserChannels,
    };
    return (
      <Home
        currentUser={this.props.currentUser}
        isAuthenticated={this.props.isAuthenticated}
        handleLogout={this.handleLogout}
        {...channelProps}
      />
    );
  }
}

export default connect(
  state => ({
    channels: state.channels.all,
    currentUserChannels: state.channels.currentUserChannels,
    currentUser: state.session.currentUser,
    isAuthenticated: state.session.isAuthenticated,
  }),
  {
    fetchChannels, createChannel, joinChannel, logout,
  },
)(HomeContainer);
