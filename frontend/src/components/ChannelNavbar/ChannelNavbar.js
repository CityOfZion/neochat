import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./ChannelNavbar.css";

const ChannelNavbar = ({ channel }) => (
  <nav className="navbar">
    <div className="Name">#{channel.name}</div>
    <div className="Options">
      <Link to={`/channel/${channel.id}/options`} className="Link">
        Options
      </Link>
    </div>
  </nav>
);

ChannelNavbar.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
  }).isRequired
};
export default ChannelNavbar;
