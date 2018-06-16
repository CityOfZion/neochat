import React from 'react';
import { Navbar, UserListItem } from 'components';
import PropTypes from 'prop-types';
import './DirectMessageAdd.css';

class DirectMessageAdd extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    createChannel: PropTypes.func.isRequired,
    createDirectMessage: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
  };

  handleChannelJoin = userId =>
    this.props.createDirectMessage({ user_id: userId }, this.context.router);

  renderUsers() {
    return this.props.users.map(user => (
      <UserListItem
        key={user.id}
        user={user}
        onChannelJoin={this.handleChannelJoin}
      />
    ));
  }

  render() {
    return (
      <div style={{ flex: '1' }}>
        <Navbar />
        <div className="card">
          <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Users</h3>
          {this.renderUsers()}
        </div>
      </div>
    );
  }
}

export default DirectMessageAdd;
