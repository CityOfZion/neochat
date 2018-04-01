import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

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

export default ChannelLink;
