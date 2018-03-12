import React from 'react';
import {Navbar, NewChannelForm, ChannelListItem} from 'components'
import './Home.css'
import PropTypes from 'prop-types';

class Home extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }
    handleNewChannelSubmit = data => this.props.createChannel(data, this.context.router);

    handleChannelJoin = channelId => this.props.joinChannel(channelId, this.context.router);

    renderChannels() {
        const currentUserChannelIds = [];
        this.props.currentUserChannels.map(channel => currentUserChannelIds.push(channel.id));

        return this.props.channels.map(channel =>
            <ChannelListItem
                key={channel.id}
                channel={channel}
                onChannelJoin={this.handleChannelJoin}
                currentUserChannelIds={currentUserChannelIds}
            />
        );
    }

    render() {
        console.log("router", this.context.router)
        return (<div style={{flex: '1'}}>
            <Navbar/>
            <div className="card">
                <h3 style={{marginBottom: '2rem', textAlign: 'center'}}>Create a new channel</h3>
                <NewChannelForm onSubmit={this.handleNewChannelSubmit}/>
            </div>
            <div className="card">
                <h3 style={{marginBottom: '2rem', textAlign: 'center'}}>Join a channel</h3>
                {this.renderChannels()}
            </div>
        </div>)
    }
}

export default Home;