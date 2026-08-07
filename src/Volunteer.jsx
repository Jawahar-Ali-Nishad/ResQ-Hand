import React from 'react';
import {useState} from 'react';
import { useNavigate } from "react-router-dom"; // 1. Imported useNavigate
import Formnavbar from './Formnavbar.jsx';
import Button from './Button';
import './index.css';
import { tamilNaduDistricts} from './Districts';
import Skillcheckbox from './Skillcheckbox';


import { db } from './firebase'; 
import { collection, addDoc } from "firebase/firestore";

export default function Volunteer() {
  const navigate = useNavigate(); // 2. Initialized navigate

  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [gender, setGender] = React.useState('Male');
  const [bldgrp, setBldgrp] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [district, setDistrict] = React.useState('');
  // const [showPrimary, setShowPrimary] = useState(false);
  // const [showSecondary, setShowSecondary] = useState(false);
  const [primarySkills, setPrimarySkills] = useState([]);
const [secondarySkills, setSecondarySkills] = useState([]);
  
  const handlePhoneChange = (e) => {
    // This regex replaces anything that is NOT a number with an empty string
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
    setPhone(onlyNumbers);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const today = new Date();
  const birthDate = new Date(dob);
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  // Adjust if they haven't had their birthday yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }

  // Safety check: Reject if they are under 16!
  if (calculatedAge < 16) {
    alert("You must be at least 16 years old to register as a volunteer.");
    return; // This stops the function so it doesn't save to Firebase
  }
    console.log("Form Submitted! Phone:", phone);

    const newVolunteer = {
  name,
  phoneNumber: phone,
  DateOfBirth: dob,
  age: calculatedAge,
  gender,
  bloodGroup: bldgrp,
  email,
  primarySkills,
  secondarySkills,
  district,
  frontlineEligible: calculatedAge >= 18,
  timestamp: new Date().toISOString(),
  status: 'Pending'
};
      

    try {
      await addDoc(collection(db, "Volunteers"), newVolunteer);
      
      alert("Your volunteer application has been submitted!");
      navigate('/'); 
      
    } catch (error) {
      console.error("Error writing to database: ", error);
      alert("Something went wrong. Please try again.");
    }

  };

  return (
    <div>
      <Formnavbar />
      
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Volunteer Registration</h2>
        <p>Fill out the details below to join the ResQ Hand team.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name"  required 
        value={name} onChange={(e) => setName(e.target.value)}/>
        <label htmlFor="dob"  style={{ display: 'block', textAlign: 'left', marginBottom: '5px', color: '#555', fontSize: '14px' }}>Date of Birth:</label>
        <input type="date" placeholder="Date of Birth" required   
        value={dob} onChange={(e) => setDob(e.target.value)}/>
        <div className="gender">
        <input type="radio" name="gender" value="male" required />
        <label htmlFor="Male">Male</label>
        <input type="radio" name="gender" value="female" onChange={(e) => setGender(e.target.value)} required />
        <label htmlFor="Female">Female</label>
        <input type="radio" name="gender" value="other" onChange={(e) => setGender(e.target.value)} required />
        <label htmlFor="Other">Other</label>
        </div>
        <select value={bldgrp} onChange={(e) => setBldgrp(e.target.value)} required>
          <option value="" disabled>-- Select Blood Group --</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" 
         value={phone} onChange={handlePhoneChange} required inputMode="numeric" pattern="[0-9]*" />
        <Skillcheckbox
           title="Primary Skills"
           selectedSkills={primarySkills}
           setSelectedSkills={setPrimarySkills}
           excludedSkills={secondarySkills}
           max={3}
         />

        <Skillcheckbox
           title="Secondary Skills"
           selectedSkills={secondarySkills}
           setSelectedSkills={setSecondarySkills}
           excludedSkills={primarySkills}
           max={3}
          />
        <select required value={district} onChange={(e) => setDistrict(e.target.value)} required>
  <option value="" disabled>-- Select a District --</option>
  {tamilNaduDistricts.map((district) => (
    <option key={district} value={district}>{district}</option>
  ))}
</select>

        {/* We use e.preventDefault() to stop the page from refreshing when you click submit */}
        <Button >
          Submit Application
        </Button>
      </form>
    </div>
  );
}