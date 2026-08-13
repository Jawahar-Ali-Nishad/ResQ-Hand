import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Admin.css'; // Assuming you have a CSS file for Admin styles
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, limit} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend} from "recharts";

export default function Admin() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    highPriorityOpen: 0,
    allOpen: 0,
    newOpen: 0,
    totalRequests: 0,
    totalVolunteers: 0
  });
  const [allRequests, setAllRequests] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  
  const requestTypeCount = {};

allRequests.forEach((request) => {
  const type = request.type || "Other";

  requestTypeCount[type] = (requestTypeCount[type] || 0) + 1;
});

const requestTypeData = Object.entries(requestTypeCount).map(
  ([name, value]) => ({
    name,
    value
  })
);

const COLORS = [
  "#ef5350",
  "#42a5f5",
  "#66bb6a",
  "#ffa726",
  "#ab47bc",
  "#26c6da",
  "#8d6e63",
  "#ec407a"
];

const statusCount = {};

allRequests.forEach((request) => {

  const status = request.status || "Pending";

  statusCount[status] = (statusCount[status] || 0) + 1;

});

const statusData = Object.entries(statusCount).map(
  ([name, value]) => ({
    name,
    value
  })
);

  useEffect(() => {
    // --- Listen to Requests ---
    const requestsRef = collection(db, "requests");
    const unsubscribeRequests = onSnapshot(requestsRef, (snapshot) => {
      const allRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllRequests(allRequests);
      const openRequests = allRequests.filter(req => req.status === 'Open' || !req.status);
      const highPriority = openRequests.filter(req => req.priority === 'High');
      
      // Calculate "New" (last 24 hours)
      const yesterday = new Date(Date.now() - 86400000); 
      const newRequests = openRequests.filter(req => {
        if (!req.timestamp) return false;
        return new Date(req.timestamp) > yesterday;
      });

      setStats(prev => ({
        ...prev,
        totalRequests: allRequests.length,
        allOpen: openRequests.length,
        highPriorityOpen: highPriority.length,
        newOpen: newRequests.length
      }));
    });

    // --- Listen to Volunteers ---
    const volunteersRef = collection(db, "Volunteers");
    const unsubscribeVolunteers = onSnapshot(volunteersRef, (snapshot) => {
      setStats(prev => ({
        ...prev,
        totalVolunteers: snapshot.docs.length
      }));
    });

    // --- Listen to Recent Requests (Limit 3) ---
    const recentQuery = query(requestsRef, orderBy("timestamp", "desc"), limit(3));
    const unsubscribeRecent = onSnapshot(recentQuery, (snapshot) => {
      setRecentRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeRequests();
      unsubscribeVolunteers();
      unsubscribeRecent();
    };
  }, []);
  return (
    <div className="admin-layout">
      {/* --- Admin Navbar --- */}
      {/* <nav className="admin-navbar" >
        <div>
          <h2 style={{ margin: 0, color: '#d9534f' }}>ResQ Hand Admin </h2>
        </div>
        <div className="admin-nav-links">
          <Link to="/">Exit Admin</Link>
          <Link to="/admin/AllRequest">All Requests</Link>
          <Link to="/admin/AllVolunteer">Volunteer Lists</Link>
        </div>
      </nav> */}
      <nav className="admin-navbar">
        <h2>ResQ Hand Admin</h2>

            {/* Navigation Links */}
        <div className={`admin-nav-links ${menuOpen ? "active" : ""}`}>
         <Link to="/">Exit Admin</Link>
          <Link to="/admin/AllRequest">All Requests</Link>
          <Link to="/admin/AllVolunteer">Volunteer Lists</Link>
        </div>

          {/* Hamburger */}
        <div className="menu-icon"onClick={() => setMenuOpen(!menuOpen)}>
         {menuOpen ? "✕" : "☰"}
        </div>
      </nav>

      {/* --- Dashboard Grid --- */}
      <div className="dashboard-grid">
        
        {/* ROW 1: Quick Stats (3 items -> span 2 each) */}
        <div className="dash-card span-2" style={{ borderTop: '4px solid #d9534f' }}>
          <h3>High Priority Open</h3>
          <h1 style={{ fontSize: '40px', margin: '10px 0', color: '#d9534f' }}>{stats.highPriorityOpen}</h1>
        </div>
        <div className="dash-card span-2" style={{ borderTop: '4px solid #f0ad4e' }}>
          <h3>All Open Requests</h3>
          <h1 style={{ fontSize: '40px', margin: '10px 0', color: '#f0ad4e' }}>{stats.allOpen}</h1>
        </div>
        <div className="dash-card span-2" style={{ borderTop: '4px solid #5cb85c' }}>
          <h3>New Open Requests</h3>
          <h1 style={{ fontSize: '40px', margin: '10px 0', color: '#5cb85c' }}>{stats.newOpen}</h1>
        </div>
      

       
        <div className="dash-card span-3" style={{ minHeight: '250px' }}>
          <h3>Emergency Requests by Type</h3>
          {/* <div style={{ marginTop: '30px', color: '#888' }}>[ Pie Chart Placeholder ]</div> */}
            <ResponsiveContainer width="100%" height={250}>
             <PieChart>
                <Pie data={requestTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                 {requestTypeData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]}/>))}
               </Pie>
                 <Tooltip />
                 <Legend />
             </PieChart>
            </ResponsiveContainer>
          </div>
        <div className="dash-card span-3" style={{ minHeight: '250px' }}>
            <h3>Requests by Status</h3>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>

                  <Pie
                     data={statusData}
                       dataKey="value"
                       nameKey="name"
                       cx="50%"
                       cy="50%"
                       outerRadius={80}
                       label
                      >

                        {statusData.map((entry, index) => (
                        <Cell
                        key={index}
                          fill={COLORS[index % COLORS.length]}
                         />))}

                  </Pie>

                  <Tooltip />

                   <Legend />

                </PieChart>
              </ResponsiveContainer>

            </div>

        
        <div 
          className="dash-card span-3 clickable-card" 
          onClick={() => navigate('/admin/AllRequest')}
        >
          <h3>Total Requests Raised</h3>
          <h1 style={{ fontSize: '30px', margin: '10px 0' }}>{stats.totalRequests}</h1>
          <p style={{ color: '#007bff' }}>Click to view all →</p>
        </div>
        
        <div 
          className="dash-card span-3 clickable-card" 
          onClick={() => navigate('/admin/AllVolunteer')}
        >
          <h3>Total Registered Volunteers</h3>
          <h1 style={{ fontSize: '30px', margin: '10px 0' }}>{stats.totalVolunteers}</h1>
          <p style={{ color: '#007bff' }}>Click to view all →</p>
        </div>

        <div className="dash-card span-6" style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Recent Requests</h3>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}> 
              {recentRequests.length > 0 ? (
                recentRequests.map(req => (
                  <li key={req.id} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                    <strong>{req.priority === 'High' ? '🚨 High:' : req.priority === 'Medium' ? '⚠️ Medium:' : '✅ Low:'}</strong> 
                    {' '}{req.type || req.description} - {req.District} 
                    <span style={{ color: '#888', fontSize: '14px', marginLeft: '10px' }}>
                      ({new Date(req.timestamp).toLocaleTimeString()})
                    </span>
                  </li>
                ))
              ) : (
                <p style={{ color: '#666' }}>No recent requests found.</p>
              )}
            </ul>
          </div>

      </div>
    </div>
  );
}