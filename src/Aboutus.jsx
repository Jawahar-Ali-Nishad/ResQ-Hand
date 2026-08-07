import React from "react";

export default function Aboutus() {
    return (
        <>
        {/* --- ABOUT US SECTION --- */}
<section style={{ padding: '80px 20px', backgroundColor: '#ffffff', textAlign: 'center' }}>
  <div style={{ maxWidth: '1000px', margin: '0 auto' }} id="AboutUs">
    
    <h2 style={{ fontSize: '36px', color: '#333', marginBottom: '20px' }}>
      About <span style={{ color: '#e53935' }}>ResQ Hand</span>
    </h2>
    
    <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', marginBottom: '50px', maxWidth: '800px', margin: '0 auto 50px auto' }}>
      When disasters strike, every second counts. ResQ Hand is a community-driven emergency response platform designed to instantly bridge the gap between people in urgent need and registered, ready-to-act volunteers. Whether it is natural floods, medical emergencies, or rescue operations, we ensure that hope is always backed by action.
    </p>

    {/* 3-Column Highlights Grid */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '30px',
      marginTop: '40px'
    }}>
      
      {/* Highlight 1 */}
      <div style={{ padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '22px', color: '#e53935', marginBottom: '15px' }}>Rapid Response</h3>
        <p style={{ color: '#555', lineHeight: '1.6' }}>
          Our real-time dashboard alerts local volunteers the moment an emergency request is submitted.
        </p>
      </div>

      {/* Highlight 2 */}
      <div style={{ padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '22px', color: '#e53935', marginBottom: '15px' }}>Verified Volunteers</h3>
        <p style={{ color: '#555', lineHeight: '1.6' }}>
          We manually vet and approve every volunteer application to ensure safe and effective on-the-ground support.
        </p>
      </div>

      {/* Highlight 3 */}
      <div style={{ padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '22px', color: '#e53935', marginBottom: '15px' }}>Community First</h3>
        <p style={{ color: '#555', lineHeight: '1.6' }}>
          Built by the community, for the community. We empower ordinary people to be heroes in times of crisis.
        </p>
      </div>

    </div>
  </div>
</section>
        </>
    )
}