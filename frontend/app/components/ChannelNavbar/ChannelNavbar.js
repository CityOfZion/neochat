import React from 'react';
import {navbar} from './styles.css'

const ChannelNavbar = (props) =>
    <nav className={navbar}>
        <div>#{props.channel.name}</div>
    </nav>;

export default ChannelNavbar;