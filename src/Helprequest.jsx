
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Imported useNavigate
import Button from './Button';
import './index.css';
import Formnavbar from './Formnavbar.jsx';

import { db } from './firebase'; 
import { collection, addDoc } from "firebase/firestore";
import { tamilNaduDistricts } from './Districts';

export default function Helprequest() {
  const navigate = useNavigate(); // 2. Initialized navigate
  
  const [phone, setPhone] = useState(''); 
  const [emergencyType, setEmergencyType] = useState('');
  const [name, setName] = useState(''); 
  const [District, setDistrict] = useState('');
  const [status, setStatus] = useState('pending'); // Added state for status
  const [desc, setDesc] = useState(''); // Added state for description
  const [location, setLocation] = useState({
  latitude: "",
  longitude: ""
  });

  const handlePhoneChange = (e) => {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
    setPhone(onlyNumbers);
  };

  const calculatePriority = (type) => {
    if (type === 'medical' || type === 'rescue' || type === 'fire' || type === 'collapse') {
      return 'High';
    } else if (type === 'food_water' || type === 'medicine' || type === 'shelter') { // Fixed 'food' to 'food_water' to match your select options
      return 'Medium';
    } else {
      return 'Low';
    }
  };

  const getCurrentLocation = () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });

            alert("Location captured successfully.");

        },

        (error) => {

            console.error(error);

            alert("Unable to get your current location.");

        },

        {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 60000
        }

    );

};

  // 3. Added the 'async' keyword right here!
  const handleSubmit = async (e) => {
    e.preventDefault(); 
     // Set status to 'Pending' when the form is submitted
    const assignedPriority = calculatePriority(emergencyType);

    const newEmergencyRequest = {
      name: name,
      phoneNumber: phone,
      District: District,
      description: desc,
      type: emergencyType,
      priority: assignedPriority,
      status: status, // Set status to 'Pending' when the form is submitted
      timestamp: new Date().toISOString(),
      location: location // Include the location object
    };

    try {
      await addDoc(collection(db, "requests"), newEmergencyRequest);
      
      alert("Your emergency request has been sent to our volunteers!");
      navigate('/'); 
      
    } catch (error) {
      console.error("Error writing to database: ", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return(
    <div>
      <Formnavbar />
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Help Request</h2>
        <p>Fill out the details below to request assistance.</p>
      </div>
      
      {/* Added your form-container class here to make it look nice */}
      <form className="form-container" onSubmit={handleSubmit}>
        
        {/* 4. Connected Name to state */}
        <input 
          type="text" 
          placeholder="Full Name" 
          required 
          className="form-input"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        
        <input 
          type="tel" 
          placeholder="Phone Number" 
          value={phone} 
          onChange={handlePhoneChange} 
          required 
          className="form-input" 
        />
        
        <select 
          className="form-input" 
          required
          value={emergencyType} 
          onChange={(e) => setEmergencyType(e.target.value)}
        >
          <option value="">Select Type of Emergency</option>
          <optgroup label="Immediate Danger">
            <option value="medical">Severe Medical Emergency</option>
            <option value="rescue">Trapped / Need Evacuation</option>
            <option value="fire">Fire Outbreak</option>
            <option value="collapse">Building / Structure Collapse</option>
          </optgroup>
          <optgroup label="Natural Disasters">
            <option value="flood">Flood / Severe Waterlogging</option>
            <option value="cyclone">Cyclone / Heavy Storm</option>
            <option value="earthquake">Earthquake</option>
          </optgroup>
          <optgroup label="Resource Requests">
            <option value="food_water">Need Food & Drinking Water</option>
            <option value="medicine">Need Basic Medical Supplies</option>
            <option value="shelter">Need Temporary Shelter</option>
          </optgroup>
          <option value="other">Other / Unlisted Emergency</option>
        </select>
        
        {/* 4. Connected District to state */}
        <select  
          placeholder="District" 
          required 
          className="form-input"
          value={District} 
          onChange={(e) => setDistrict(e.target.value)} 
        >
          <option value="">Select District</option>
          {tamilNaduDistricts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>

        <input 
          type="text" 
          placeholder="Give Your Exact Location e.g., Street Name, Landmark. Explain the situation in brief." 
          className="form-input"
          value={desc} 
          onChange={(e) => setDesc(e.target.value)} 
        />

        <button
           type="button"
           className="form-input"
           onClick={getCurrentLocation}
          >
           📍 Share Current Location
          </button>

        <Button>
         Send Request
        </Button>
      </form>
    </div>
  )
}