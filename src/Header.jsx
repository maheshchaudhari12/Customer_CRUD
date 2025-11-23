import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import a CSS file for styling

function Header() {
    return (
        <header className="main-header">
            <div className="logo">
                <Link to="/">My Website</Link>
            </div>
            <nav className="nav-links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;