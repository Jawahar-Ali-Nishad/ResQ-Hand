import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Homepage.jsx'; 
import Volunteer from './Volunteer.jsx';
import Helprequest from './Helprequest.jsx'; 
import Admin from './Admin.jsx'; 
import AllRequest from './AllRequest.jsx';
import AllVolunteer from './AllVolunteer.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Home />} />
       
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/helprequest" element={<Helprequest />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/AllRequest" element={<AllRequest />} />
        <Route path="/admin/AllVolunteer" element={<AllVolunteer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;