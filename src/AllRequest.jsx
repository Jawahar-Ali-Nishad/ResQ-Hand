console.log("working fiiweoifhweufhwuefine");
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase'; 
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import './index.css';


export default function AllRequests() {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time'); 
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const requestsRef = collection(db, "requests");

    
    const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
      
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      
      setRequests(requestsData);
      setIsLoading(false); 
    }, (error) => {
      console.error("Error fetching live requests: ", error);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredRequests = requests.filter(req => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (req.name && req.name.toLowerCase().includes(searchLower)) ||
      (req.District && req.District.toLowerCase().includes(searchLower)) ||
      (req.priority && req.priority.toLowerCase().includes(searchLower)) ||
      (req.phoneNumber && req.phoneNumber.includes(searchTerm))
    );
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === 'time') {
      return new Date(b.timestamp) - new Date(a.timestamp); 
    } else if (sortBy === 'priority') {
      const priorityValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return (priorityValues[b.priority] || 0) - (priorityValues[a.priority] || 0);
    }
    return 0;
  });

  const reverseGeocode = async (latitude, longitude) => {

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch location.");
        }

        const data = await response.json();

        const address = data.address || {};

        return {

            street:
                address.road ||
                address.residential ||
                address.pedestrian ||
                "",

            locality:
                address.suburb ||
                address.neighbourhood ||
                address.hamlet ||
                "",

            city:
                address.city ||
                address.town ||
                address.village ||
                "",

            district:
                address.county ||
                address.city_district ||
                address.state_district ||
                "",

            state:
                address.state || "",

            country:
                address.country || "",

            fullAddress:
                data.display_name || ""

        };

    }

    catch (error) {

        console.error(error);

        return null;

    }

};

const handleViewDetails = async (req) => {

  console.log("View Details Clicked");
    console.log(req);
    if (
        !req.location ||
        !req.location.latitude ||
        !req.location.longitude
    ) {

        setSelectedRequest(req);

        return;

    }

    const address = await reverseGeocode(
        req.location.latitude,
        req.location.longitude
    );

    setSelectedRequest({

        ...req,

        address

    });

};

  const handleReject = async () => {
    try {
      const requestRef = doc(db, "requests", selectedRequest.id);
      await updateDoc(requestRef, {
        status: 'Rejected'
      });

      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id ? { ...req, status: 'Rejected' } : req
        )
      );
      
      setSelectedRequest(null); 

    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Could not reject the request. Please try again.");
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      
    
    } catch (error) {
      console.error("Error deleting request: ", error);
      alert("Could not remove the request from the database.");
    }
  };

  const handleAccept = async () => {
     try {
      const requestRef = doc(db, "requests", selectedRequest.id);
      await updateDoc(requestRef, {
        status: 'Open' 
      });

      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id ? { ...req, status: 'Open' } : req
        )
      );
      
      setSelectedRequest(null); 

    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Could not accept the request. Please try again.");
    }
  };

  const handleResolved = async () => {
     try {
      const requestRef = doc(db, "requests", selectedRequest.id);
      await updateDoc(requestRef, {
        status: 'Resolved' 
      });

      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id ? { ...req, status: 'Resolved' } : req
        )
      );
      
      setSelectedRequest(null); 

    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Could not resolve the request. Please try again.");
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
        <h2 style={{ marginBottom: '20px' }}>Active Emergencies</h2>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search by name, District, phone, or priority..." 
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
            <option value="priority">Sort by: Highest Priority</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
         {isLoading ? (
               <>
               <div className="skeleton-card"></div>
               <div className="skeleton-card"></div>
               <div className="skeleton-card"></div>
               </>
          ) : sortedRequests.length > 0 ?  (
            sortedRequests.map((req) => {
              
              const isRejected = req.status === 'Rejected';
              const isResolved = req.status === 'Resolved';
              
              return (
                <div 
                  key={req.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '20px', 
                    backgroundColor: isRejected ? '#e0e0e0' : isResolved ? '#9ef7dc' : '#fff', 
                    borderRadius: '8px',     
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
                    borderLeft: isRejected ? '6px solid #9e9e9e' : isResolved ? '6px solid #edfa9f' : req.priority === 'High' ? '6px solid #d32f2f' : req.priority === 'Medium' ? '6px solid #f57c00' : '6px solid #388e3c',
                    textAlign: 'left',
                    opacity: isRejected ? 0.8 : 1
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: isRejected ? '#555' : '#000', textDecoration: isRejected ? 'line-through' : 'none' }}>
                      {req.name} <span style={{ fontSize: '15px', color: '#666', fontWeight: 'normal', textDecoration: 'none' }}>({req.phoneNumber})</span>
                    </h3>
                    <p style={{ margin: '0 0 5px 0', color: '#444', fontSize: '16px' }}>
                      <strong>District:</strong> {req.District} | <strong>Type:</strong> {req.type} | <strong>Status:</strong> {req.status || 'Open'}
                    </p>
                    <small style={{ display: 'block', color: '#888', marginTop: '8px' }}>
                      {new Date(req.timestamp).toLocaleString()}
                    </small>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span style={{ 
                      padding: '8px 16px', 
                      borderRadius: '20px', 
                      backgroundColor: isRejected ? '#eeeeee' : req.priority === 'High' ? '#ffebee' : req.priority === 'Medium' ? '#fff3e0' : '#e8f5e9',
                      color: isRejected ? '#757575' : req.priority === 'High' ? '#c62828' : req.priority === 'Medium' ? '#ef6c00' : '#2e7d32',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '14px'
                    }}>
                      {isRejected ? 'Rejected' : req.priority}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      
                      {(isRejected || isResolved) && (
                        <button 
                          onClick={() => handleRemove(req.id)}
                          style={{
                            padding: '4px 14px',
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
                        onClick={() => {
                          handleViewDetails(req);
                          console.log("View Details Clicked");
                        }}
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
              <h3 style={{ color: '#666' }}>No active requests found.</h3>
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          
          <div style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
            width: '90%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              Emergency Details
            </h2>

            <div style={{ marginBottom: '25px', lineHeight: '1.8', fontSize: '16px' }}>
               <p style={{ margin: '5px 0' }}><strong>Name:</strong> {selectedRequest.name}</p>
               <p style={{ margin: '5px 0' }}><strong>Phone Number:</strong> {selectedRequest.phoneNumber}</p>
               <p style={{ margin: '5px 0' }}><strong>District:</strong> {selectedRequest.District}</p>
               <p style={{ margin: '5px 0' }}><strong>Emergency Type:</strong> {selectedRequest.type}</p>
               <p style={{ margin: '5px 0' }}><strong>Status:</strong> {selectedRequest.status}</p>
               <p style={{ margin: '5px 0' }}><strong>Desc:</strong> {selectedRequest.description || 'Not provided'}</p>
               <p style={{ margin: '5px 0' }}>
               <strong>Location:</strong>
               </p>

               <p>
                {selectedRequest.address?.fullAddress}
               </p>
               <p style={{ margin: '5px 0' }}>
                 <strong>Priority:</strong>
                  <span style={{ 
                    color: selectedRequest.priority === 'High' ? '#c62828' : 
                    selectedRequest.priority === 'Medium' ? '#ef6c00' : '#2e7d32', 
                     fontWeight: 'bold', marginLeft: '5px' 
                      }}>
                     {selectedRequest.priority}
                  </span>
                </p>
                <p style={{ margin: '5px 0' }}><strong>Time Reported:</strong> {new Date(selectedRequest.timestamp).toLocaleString()}</p>
              </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedRequest(null)} 
                style={{ padding: '10px 20px', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Close
              </button>
              
              {selectedRequest.status !== 'Rejected' && selectedRequest.status !== 'Resolved' && (
                <button 
                  onClick={handleReject}
                  style={{ padding: '10px 20px', border: 'none', backgroundColor: '#d32f2f', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Reject
                </button>
              )}
              
              
              {selectedRequest.status !== 'Rejected' && selectedRequest.status !== 'Open' && selectedRequest.status !== 'Resolved' && (
                <button 
                  onClick={handleAccept}
                  style={{ padding: '10px 20px', border: 'none', backgroundColor: '#2e7d32', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Accept
                </button>
              )}
              {selectedRequest.status == 'Open' && (
                <button onClick={handleResolved}
                
                  style={{ padding: '10px 20px', border: 'none', backgroundColor: '#8ae88f', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✅Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
