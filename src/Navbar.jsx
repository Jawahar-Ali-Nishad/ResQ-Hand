
import { Link } from "react-router-dom";
import { useState } from "react";
import './Homenav.css'; // Assuming you have a CSS file for Navbar styles

export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="home-navbar">
            <h2 style={{ paddingLeft: "20px" }}>ResQ Hand</h2>
            <div className={`home-nav-links ${menuOpen ? "active" : ""}`}>
                <Link to="/helprequest">Request Help</Link>
                <a href="#AboutUs">About Us</a>
                <a href="#HowItWorks">How It Works</a>
                <Link to="/admin">Admin</Link>
            </div>
            <div className="home-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? "✕" : "☰"}
            </div>
        </nav>
    );
}