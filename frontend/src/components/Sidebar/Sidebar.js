import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css'
import {Route} from "react-router-dom";

class ChannelLink extends Component {
    static props = {
        channel: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    }

    render() {
        const {channel} = this.props;
        return (
            <Route
                path={`/channel/${channel.id}`}
                exact={true}
                children={({match}) => (
                    <div className={match ? "active" : ""}>
                        <Link to={`/channel/${channel.id}`}
                              className={match ? ["channelLink", "channelLinkSelected"].join(' ') : "channelLink"}>
                            <span>{channel.name}</span>
                        </Link>
                    </div>
                )}
            />


        )
    }
}

class Sidebar extends Component {
    static props = {
        rooms: PropTypes.array.isRequired,
        router: PropTypes.object.isRequired,
        onLogoutClick: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired,
    }

    render() {
        const {channels, router, onLogoutClick, username: user} = this.props
        return (
            <div className="sidebar">
                <div className="header">NeoChat</div>
                <div className="username">{user}</div>
                <div className="channelsTitle">Channels</div>
                {channels.map(channel => <ChannelLink key={channel.id} channel={channel}/>)}
                <Link
                    to="/"
                    className="link"
                >
                    <div className="channelLink">
                        <span className="fa fa-plus"/>
                    </div>
                </Link>
                <div style={{flex: '1'}}/>
                <button
                    onClick={() => onLogoutClick(router)}
                    className={["link", "logoutButton"].join(' ')}
                >
                    <div className="channelLink">
                        <span className="fa fa-sign-out"/>
                    </div>
                </button>
            </div>
        )
    }
}

export default Sidebar;