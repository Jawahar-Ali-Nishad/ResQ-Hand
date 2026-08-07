import React from 'react';

export default function HowItWorks() {
  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }} id="HowItWorks">
        
        <h2 style={{ fontSize: '36px', color: '#333', marginBottom: '10px' }}>
          How It <span style={{ color: '#e53935' }}>Works</span>
        </h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '50px' }}>
          Getting help or giving help is designed to be as fast and simple as possible.
        </p>

        {/* 3-Step Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '30px',
          position: 'relative'
        }}>
          
          {/* Step 1 */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '40px 30px', 
            borderRadius: '12px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            position: 'relative'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📍</div>
            <h3 style={{ fontSize: '22px', color: '#333', marginBottom: '15px' }}>1. Submit a Request</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Victims or bystanders drop a pin on their exact location and describe the emergency or supplies needed.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '40px 30px', 
            borderRadius: '12px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            position: 'relative'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📡</div>
            <h3 style={{ fontSize: '22px', color: '#333', marginBottom: '15px' }}>2. Smart Alert</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Our system instantly broadcasts the active request to verified volunteers and rescue teams in that specific district.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '40px 30px', 
            borderRadius: '12px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            position: 'relative'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤝</div>
            <h3 style={{ fontSize: '22px', color: '#333', marginBottom: '15px' }}>3. Help Arrives</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Volunteers claim the request on their dashboard, coordinate with each other, and arrive on the scene to provide relief.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}