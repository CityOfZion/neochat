import React from 'react';
import { Link } from 'react-router-dom';
import { navbar, link } from './styles.css'

const Navbar = () =>
    <nav className={navbar}>
        <Link to="/" className={link}>NeoChat</Link>
    </nav>;

export default Navbar;