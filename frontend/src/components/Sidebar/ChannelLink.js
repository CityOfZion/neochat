import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const ChannelLink = ({ name, id, newMessages }) => (
  <NavLink
    to={`/channel/${id}`}
    className={
      newMessages ? "channelLink channelLinkNewMessages" : "channelLink"
    }
    activeClassName="channelLinkSelected"
  >
    <span>{name} </span>
  </NavLink>
);

ChannelLink.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  newMessages: PropTypes.bool.isRequired
};

export default ChannelLink;
