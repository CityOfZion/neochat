import React from "react";
import PropTypes from "prop-types";
import "./ChannelUserList.css";

const ChannelUserList = ({ userStatus }) => (
  <div className="channelUserList">
    <ul>
      {userStatus.map(({ username, id }) => {
        return <li key={id}>{username}</li>;
      })}
    </ul>
  </div>
);

ChannelUserList.propTypes = {
  userStatus: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    })
  ).isRequired
};

export default ChannelUserList;
