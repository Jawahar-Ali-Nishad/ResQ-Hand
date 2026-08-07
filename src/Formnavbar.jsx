import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Formnavbar() {
  const navigate = useNavigate();

return (
<nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px 15px', backgroundColor: '#f0f0f0' }}>      <div>
        {/* We will replace this with your actual logo from assets later */}
        <h2 style={{color: '#333'}}>ResQ Hand</h2> 
      </div>
      <div>
        <button onClick={() => navigate('/')} style={{ marginRight: '15px', textDecoration: 'none', color: '#333', border: 'none', backgroundColor: 'transparent' }}>Home</button>
      </div>
    </nav>
)

}