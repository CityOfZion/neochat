import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

const Navbar = () =>
    <nav className="Navbar">
        <Link to="/" className="Link">NeoChat</Link>
    </nav>;

export default Navbar;