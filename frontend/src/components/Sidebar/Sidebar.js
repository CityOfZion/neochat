import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import ChannelLink from "./ChannelLink";
import "./Sidebar.css";

const Sidebar = ({
  channels,
  history,
  onLogoutClick,
  username: user,
  direct_messages
}) => {
  if (!user) return null;
  const directMessageLinks = direct_messages.map(channel => (
    <ChannelLink key={channel.id} channel={channel} />
  ));
  const channelLinks = channels.map(channel => (
    <ChannelLink key={channel.id} channel={channel} />
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
  channels: PropTypes.array.isRequired,
  direct_messages: PropTypes.array.isRequired
};

export default withRouter(Sidebar);
