import React from "react";
import { Link, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import "./Sidebar.css";

const Sidebar = ({ channels, router, onLogoutClick, username: user }) => (
  <div className="sidebar">
    <div className="header">NeoChat</div>
    <div className="username">{user}</div>
    <div className="channelsTitle">Channels</div>
    {channels.map(channel => (
      <ChannelLink key={channel.id} channel={channel} />
    ))}
    <Link to="/" className="link">
      <div className="channelLink">
        <span className="fa fa-plus" />
      </div>
    </Link>
    <div style={{ flex: "1" }} />
    <button
      onClick={() => onLogoutClick(router)}
      className={["link", "logoutButton"].join(" ")}
    >
      <div className="channelLink">
        <span className="fa fa-sign-out" />
      </div>
    </button>
  </div>
);

const ChannelLink = ({ channel }) => (
  <NavLink
    to={`/channel/${channel.id}`}
    className="channelLink"
    activeClassName="channelLinkSelected"
  >
    <span>{channel.name}</span>
  </NavLink>
);

ChannelLink.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

Sidebar.propTypes = {
  rooms: PropTypes.array.isRequired,
  router: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  channels: PropTypes.array.isRequired
};

export default Sidebar;
