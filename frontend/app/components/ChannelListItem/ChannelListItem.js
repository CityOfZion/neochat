import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ChannelListItem extends Component {
    static props = {
        channel: {
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        },
        currentUserChannelIds: PropTypes.array.isRequired,
        onChannelJoin: PropTypes.func.isRequired
    }

    render() {
        const {channel, currentUserChannelIds, onChannelJoin} = this.props;
        const isJoined = currentUserChannelIds.includes(channel.id);
        return (
            <div key={channel.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <span style={{marginRight: '8px'}}>{channel.name}</span>
                <button
                    onClick={() => onChannelJoin(channel.id)}
                    className="btn btn-sm"
                    disabled={isJoined}
                >
                    {isJoined ? 'Joined' : 'Join'}
                </button>
            </div>
        )
    }


}

export default ChannelListItem;