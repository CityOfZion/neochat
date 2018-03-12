import React from 'react';
import './ChannelNavbar.css'

const ChannelNavbar = (props) =>
    <nav className="navbar">
        <div>#{props.channel.name}</div>
    </nav>;

export default ChannelNavbar;