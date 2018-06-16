import React from 'react';
import PropTypes from 'prop-types';
import './ChannelUserList.css';

const ChannelUserList = ({ userStatus }) => (
  <div className="channelUserList">
    <span className="listHeader">ONLINE ({userStatus.online.length})</span>
    <ul>
      {userStatus.online.map(({ username, id, status }) => (
        <li key={id}>
          <span className={`${status}Status`}>◉</span>
          {username}
        </li>
      ))}
    </ul>
    <span className="listHeader">OFFLINE ({userStatus.offline.length})</span>
    <ul>
      {userStatus.offline.map(({ username, id, status }) => (
        <li key={id}>
          <span className={`${status}Status`}>◉</span>
          {username}
        </li>
      ))}
    </ul>
  </div>
);

ChannelUserList.propTypes = {
  userStatus: PropTypes.object.isRequired,
};

export default ChannelUserList;
