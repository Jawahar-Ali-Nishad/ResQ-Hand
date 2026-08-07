import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button.jsx'; // Import the Button component
import heroImage from './assets/hero-image.png'; // Import your rescue image

export default function Hero() {
  const navigate = useNavigate();
  const heroStyle = {
    // We use the imported image as the background
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    textAlign: 'center',
    padding: '100px 20px', // More padding to give the background space
    color: 'white', // Ensure text is visible
    textShadow: '0 2px 4px rgba(0,0,0,0.5)', // Optional: text shadow for better contrast
    position: 'relative', // Necessary if you want absolute elements inside
  };

  const overlayStyle = {
    // Semi-transparent overlay to ensure text is always readable
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2, // Keeps text/buttons on top of the overlay
  };

  return (
    <div style={heroStyle}>
      {/* Optional: Add an overlay div to ensure text readability against busy images */}
      <div style={overlayStyle}></div>

      <div style={contentStyle}>
        <h2>"Hope in Action, Help in Time"</h2>
        <p>We are with you.</p>

        <div style={{ marginTop: '20px' }}>
          <Button onClick={() => navigate('/volunteer')}>
            Join Volunteer
          </Button>
          <Button onClick={() => navigate('/Helprequest')}>
            Need Help
          </Button>
        </div>
      </div>
    </div>
  );
}