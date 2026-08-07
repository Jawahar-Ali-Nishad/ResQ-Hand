import React from 'react';

export default function Button({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ margin: '20px 70px', padding: '10px 20px', cursor: 'pointer' }}>
      {children}
    </button>
  );
}