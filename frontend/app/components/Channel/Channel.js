import React, {Component} from 'react';
import {ChannelNavbar, MessageList} from 'components'
import  {MessageFormContainer} from 'containers'

class Channel extends Component {
    handleMessageCreate = (data) => {
        this.props.createMessage(this.props.phx_channel, data);
    }

    render() {
        return(
            <div style={{display: 'flex', height: '100vh', width: '100%'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                    <ChannelNavbar channel={this.props.channel}/>
                    <MessageList messages={this.props.messages}/>
                    <MessageFormContainer onSubmit={this.handleMessageCreate}/>
                </div>
            </div>
        )
    }
}

export default Channel;