import React from 'react';
import PropTypes from 'prop-types';

const ChannelListItem = ({ channel, currentUserChannelIds, onChannelJoin }) => {
  const isJoined = currentUserChannelIds.includes(channel.id);
  return (
    <div
      key={channel.id}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      <span style={{ marginRight: '8px' }}>{channel.name}</span>
      <button
        onClick={() => onChannelJoin(channel.id)}
        className="btn btn-sm"
        disabled={isJoined}
      >
        {isJoined ? 'Joined' : 'Join'}
      </button>
    </div>
  );
};

ChannelListItem.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  currentUserChannelIds: PropTypes.array.isRequired,
  onChannelJoin: PropTypes.func.isRequired,
};

export default ChannelListItem;
