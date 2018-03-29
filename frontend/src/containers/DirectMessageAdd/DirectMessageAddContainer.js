import React from "react";
import PropTypes from "prop-types";
import { DirectMessageAdd } from "components";
import { connect } from "react-redux";
import { fetchUsers, createDirectMessage } from "../../actions/direct_messages";

class DirectMessageContainer extends React.Component {
  static propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    createDirectMessage: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired
  };
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const channelProps = {
      createDirectMessage: this.props.createDirectMessage,
      users: this.props.users
    };
    return <DirectMessageAdd {...channelProps} />;
  }
}

export default connect(
  state => ({
    users: state.direct_messages.users,
    channels: state.channels.all,
    currentUser: state.session.currentUser
  }),
  { fetchUsers, createDirectMessage }
)(DirectMessageContainer);
