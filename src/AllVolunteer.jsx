console.log("working 129837198724981");
  
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase'; 
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// 1. SET YOUR EXACT FIREBASE FOLDER NAME HERE:
const COLLECTION_NAME = "Volunteers"; 

export default function AllVolunteers() {
  const [isLoading, setIsLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time'); 
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const volunteersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVolunteers(volunteersData);
      } catch (error) {
        console.error("Error fetching volunteers: ", error);
      }
      finally {
        setIsLoading(false); 
      }
    };

    fetchVolunteers();
  }, []); 

  const filteredVolunteers = volunteers.filter(vol => {
    if (!searchTerm) return true; // Show everyone if search is empty
    
    const searchLower = searchTerm.toLowerCase();
    
    // Safely check fields, preventing crashes if data is missing
    const nameMatch = vol.name ? String(vol.name).toLowerCase().includes(searchLower) : false;
    const locMatch = vol.location ? String(vol.location).toLowerCase().includes(searchLower) : false;
    const distMatch = vol.district ? String(vol.district).toLowerCase().includes(searchLower) : false;
    const phoneMatch = vol.phoneNumber ? String(vol.phoneNumber).includes(searchTerm) : false;

    return nameMatch || locMatch || distMatch || phoneMatch;
  });
  
  const sortedVolunteers = [...filteredVolunteers].sort((a, b) => {
    if (sortBy === 'time') {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA; 
    } 
    else if (sortBy === 'name-asc') {
      return String(a.name || '').localeCompare(String(b.name || ''));
    } 
    else if (sortBy === 'name-desc') {
      return String(b.name || '').localeCompare(String(a.name || ''));
    }
    return 0;
  });

  const handleReject = async () => {
    try {
      const volunteerRef = doc(db, COLLECTION_NAME, selectedVolunteer.id);
      await updateDoc(volunteerRef, {
        status: 'Rejected'
      });
        
      setVolunteers(prevVolunteers => 
        prevVolunteers.map(vol => 
          vol.id === selectedVolunteer.id ? { ...vol, status: 'Rejected' } : vol
        )
      );
      
      setSelectedVolunteer(null); 
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Could not reject the application.");
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      setVolunteers(prevVolunteers => prevVolunteers.filter(vol => vol.id !== id));
    } catch (error) {
      console.error("Error deleting volunteer: ", error);
      alert("Could not remove the volunteer.");
    }
  };

  const handleAccept = async () => {
    try {
      const volunteerRef = doc(db, COLLECTION_NAME, selectedVolunteer.id);
      await updateDoc(volunteerRef, {
        status: 'Active' 
      });

      const response = await fetch("https://resq-hand.onrender.com/", {
         method: "POST",
          headers: {
                      "Content-Type": "application/json",
                   },
          body: JSON.stringify({
             name: selectedVolunteer.name,
              email: selectedVolunteer.email,
            }),
       });

const data = await response.json();

console.log("Backend Response:", data);
    
      setVolunteers(prevVolunteers => 
        prevVolunteers.map(vol => 
          vol.id === selectedVolunteer.id ? { ...vol, status: 'Active' } : vol
        )
      );
          
      setSelectedVolunteer(null); 
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Could not accept the application.");
    }
  };

  return (
    <div className='srchpage'>
      
      <nav className='srchnav'>
        <h2 style={{ margin: 0, color: '#e53935' }}>ResQ Hand</h2>
        <Link to="/admin" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333', fontSize: '18px' }}>
          Admin
        </Link>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px' }}>All Volunteers</h2>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search by name, location, or phone..." 
            style={{ flex: 1, minWidth: '300px', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            style={{ width: 'auto', cursor: 'pointer', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="time">Sort by: Newest First</option>
            <option value="name-asc">Sort by: Name (A-Z)</option>
            <option value="name-desc">Sort by: Name (Z-A)</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {isLoading ? (
            <>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </>
          ) : sortedVolunteers.length > 0 ? (
            sortedVolunteers.map((vol) => {
              
              const isRejected = vol.status === 'Rejected';
              const isAccepted = vol.status === 'Active';
              const currentStatus = vol.status || 'Pending';
              
              return (
                <div 
                  key={vol.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '20px', 
                    backgroundColor: isRejected ? '#e0e0e0' : '#fff', 
                    borderRadius: '8px',     
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
                    borderLeft: isRejected ? '6px solid #9e9e9e' : isAccepted ? '6px solid #388e3c' : '6px solid #1976d2',
                    textAlign: 'left',
                    opacity: isRejected ? 0.8 : 1
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: isRejected ? '#555' : '#000', textDecoration: isRejected ? 'line-through' : 'none' }}>
                      {vol.name || 'Unnamed Volunteer'} <span style={{ fontSize: '15px', color: '#666', fontWeight: 'normal', textDecoration: 'none' }}>({vol.phoneNumber || 'No Phone'})</span>
                    </h3>
                    <p style={{ margin: '0 0 5px 0', color: '#444', fontSize: '16px' }}>
                      <strong>Location:</strong> {vol.district || vol.location || 'Unknown'} | <strong>Status:</strong> {currentStatus}
                    </p>
                    <small style={{ display: 'block', color: '#888', marginTop: '8px' }}>
                      {vol.timestamp ? new Date(vol.timestamp).toLocaleString() : 'No Date Provided'}
                    </small>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span style={{ 
                      padding: '8px 16px', 
                      borderRadius: '20px', 
                      backgroundColor: isRejected ? '#c2bdbd' : isAccepted ? '#bcf7bf' : '#e3f2fd',
                      color: isRejected ? '#757575' : isAccepted ? '#2e7d32' : '#1565c0',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '14px'
                    }}>
                      {currentStatus}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      
                      {isRejected && (
                        <button 
                          onClick={() => handleRemove(vol.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#d32f2f', 
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}
                        >
                          Remove
                        </button>
                      )}

                      <button 
                        onClick={() => setSelectedVolunteer(vol)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: isRejected ? '#757575' : '#1976d2',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '8px' }}>
              <h3 style={{ color: '#666' }}>No active volunteers found.</h3>
            </div>
          )}
        </div>
      </div>

      {selectedVolunteer && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          
          <div style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
            width: '90%', maxWidth: '700px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              Volunteer Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px' }}>
              <div style={{ lineHeight: '1.8', fontSize: '16px', width: '350px' }}>
               <p style={{ margin: '5px 0' }}><strong>Name:</strong> {selectedVolunteer.name || 'N/A'}</p>
               <p style={{ margin: '5px 0' }}><strong>Gender:</strong> {selectedVolunteer.gender || 'N/A'}</p>
               <p style={{ margin: '5px 0' }}><strong>Date Of Birth:</strong> {selectedVolunteer.DateOfBirth || 'N/A'}</p>
                <p style={{ margin: '5px 0' }}><strong>Age:</strong> {selectedVolunteer.age || 'N/A'}</p>
                <p style={{ margin: '5px 0' }}><strong>Blood Group:</strong> {selectedVolunteer.bloodGroup || 'N/A'}</p>
               <p style={{ margin: '5px 0' }}><strong>Email:</strong> {selectedVolunteer.email || 'N/A'}</p>
               </div>
               <div style={{ lineHeight: '1.8', fontSize: '16px', width: '350px' }}>
               <p style={{ margin: '5px 0' }}><strong>Primary Skills:</strong> {selectedVolunteer.primarySkills?.join(', ') || 'N/A'}</p>
               <p style={{ margin: '5px 0' }}><strong>Secondary Skills:</strong> {selectedVolunteer.secondarySkills?.join(', ') || 'N/A'}</p>
               <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {selectedVolunteer.phoneNumber || 'N/A'}</p>
               <p style={{ margin: '5px 0' }}><strong>Location:</strong> {selectedVolunteer.district || selectedVolunteer.location || 'N/A'}</p>
               <p style={{ margin: '5px 0' }}><strong>Status:</strong> {selectedVolunteer.status || 'Pending'}</p>
               <p style={{ margin: '5px 0' }}><strong>Frontline Eligible:</strong> {selectedVolunteer.frontlineEligible ? 'Yes' : 'No'}</p>
                 <p><strong>Applied:</strong> {selectedVolunteer.timestamp ? new Date(selectedVolunteer.timestamp).toLocaleString() : 'No Date'}
               </p>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedVolunteer(null)} 
                style={{ padding: '10px 20px', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Close
              </button>
              
              {selectedVolunteer.status !== 'Rejected' && selectedVolunteer.status !== 'Active' && (
                <>
                  <button 
                    onClick={handleReject}
                    style={{ padding: '10px 20px', border: 'none', backgroundColor: '#d32f2f', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Reject
                  </button>
                  <button 
                    onClick={handleAccept}
                    style={{ padding: '10px 20px', border: 'none', backgroundColor: '#2e7d32', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Accept
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  ); 
}