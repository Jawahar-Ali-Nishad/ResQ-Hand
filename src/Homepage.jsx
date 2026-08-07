import React from 'react';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx'; // Assuming you have an Admin component
import Aboutus from './Aboutus.jsx';
import EmergencyBanner from './Emergencybanner.jsx';
import Footer from './Footer.jsx';
import HowItWorks from './Howitworks.jsx';

export default function Homepage() {
  return (
    <div>
      <Navbar />
      <EmergencyBanner/>
      <Hero />
      <Aboutus />
      <HowItWorks />
      <Footer />
    </div>
    
  );
}