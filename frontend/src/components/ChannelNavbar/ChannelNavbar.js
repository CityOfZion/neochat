import React from 'react';
import './ChannelNavbar.css'
import { Link } from 'react-router-dom';

const ChannelNavbar = (props) =>
    <nav className="navbar">
        <div className="Name">#{props.channel.name}</div>
        <div className="Options"><Link to={`/channel/${props.channel.id}/options`} className="Link">Options</Link></div>
    </nav>;

export default ChannelNavbar;