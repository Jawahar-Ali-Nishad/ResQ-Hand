// import React from 'react';

// export default function EmergencyBanner() {
//   return (
//     <div style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '12px 20px', textAlign: 'center', width: '100%' }}>
//       <div style={{ 
//         maxWidth: '1200px', 
//         margin: '0 auto', 
//         display: 'flex', 
//         flexDirection: 'column', 
//         alignItems: 'center', 
//         justifyContent: 'center',
//         gap: '8px'
//       }}>
        
//         {/* The Numbers Grid */}
//         <div style={{ 
//           marque: 'scroll',
//           display: 'flex', 
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           gap: '20px', 
//           flexWrap: 'wrap',
//           fontSize: '15px',
//           fontWeight: 'bold'
//         }}>
//           <span style={{ color: '#e53935', letterSpacing: '1px' }}>OFFICIAL EMERGENCY:</span>
//           <span>🚨 National: <span style={{ color: '#e53935' }}>112</span></span>
//           <span>🚑 Ambulance: <span style={{ color: '#e53935' }}>108</span></span>
//           <span>🚓 Police: <span style={{ color: '#e53935' }}>100</span></span>
//           <span>🌊 Disaster: <span style={{ color: '#e53935' }}>1078</span></span>
//         </div>

//         {/* The Safety Disclaimer */}
//         <span style={{ fontSize: '12px', color: '#888' }}>
//           * For immediate, life-threatening situations, contact local authorities directly.
//         </span>

//       </div>
//     </div>
//   );
// }

import React from "react";

const emergencyNumbers = [
  { icon: "🚨", label: "National", number: "112" },
  { icon: "🚑", label: "Ambulance", number: "108" },
  { icon: "🚓", label: "Police", number: "100" },
  { icon: "🔥", label: "Fire", number: "101" },
  { icon: "🌊", label: "Disaster", number: "1078" },
];

export default function EmergencyBanner() {
  return (
    <div className="emergency-banner">

      <div className="banner-track">

        {[1, 2].map((copy) => (
          <div className="banner-content" key={copy}>

            <span className="heading">
              🚨 OFFICIAL EMERGENCY NUMBERS
            </span>

            {emergencyNumbers.map((item) => (
              <span key={item.label}>
                {item.icon} {item.label}: <strong>{item.number}</strong>
              </span>
            ))}

            <span className="disclaimer">
              * For immediate life-threatening situations, contact local authorities directly.
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}