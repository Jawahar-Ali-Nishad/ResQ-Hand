import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '10px 0', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} ResQ Hand. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
