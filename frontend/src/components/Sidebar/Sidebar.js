import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import ChannelLink from "./ChannelLink";
import "./Sidebar.css";

const Sidebar = ({
  channels,
  currentUserChannels,
  history,
  onLogoutClick,
  username: user,
  direct_messages
}) => {
  if (!user) return null;

  // TODO channels[id] should not be undefined
  const newMessages = id =>
    channels[id] !== undefined &&
    channels[id] &&
    channels[id].newMessages.length !== 0;

  const directMessageLinks = direct_messages.map(channel => (
    <ChannelLink
      key={channel.id}
      name={channel.name}
      id={channel.id}
      newMessages={newMessages(channel.id)}
    />
  ));

  const channelLinks = currentUserChannels.map(channel => (
    <ChannelLink
      key={channel.id}
      name={channel.name}
      id={channel.id}
      newMessages={newMessages(channel.id)}
    />
  ));

  return (
    <div className="sidebar">
      <div className="header">
        <Link to="/">NeoChat</Link>
      </div>
      <div className="username">{user}</div>
      <div className="channelsTitle">
        Channels
        <Link to="/" className="link">
          <span className="fa fa-plus" />
        </Link>
        {channelLinks}
      </div>
      <div className="channelsTitle">
        Direct Messages
        <Link to="/direct_messages" className="link">
          <span className="fa fa-plus" />
        </Link>
        {directMessageLinks}
      </div>
      <button
        onClick={() => onLogoutClick(history)}
        className="btn btn-primary"
      >
        Logout
      </button>
    </div>
  );
};

Sidebar.defaultProps = {
  username: ""
};

Sidebar.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  username: PropTypes.string,
  channels: PropTypes.any.isRequired,
  currentUserChannels: PropTypes.array.isRequired,
  direct_messages: PropTypes.array.isRequired
};

export default withRouter(Sidebar);
