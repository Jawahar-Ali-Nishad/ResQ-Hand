import React from 'react'; // 'React' should usually be capitalized
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Homepage.jsx'; // Changed to match your pages folder
import Volunteer from './Volunteer.jsx';
import Helprequest from './Helprequest.jsx'; // Assuming you have a HelpRequest component
import Admin from './Admin.jsx'; // Assuming you have an Admin component
import AllRequest from './AllRequest.jsx';
import AllVolunteer from './AllVolunteer.jsx'; // Assuming you have an AllVolunteer component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* When the URL is exactly '/', show the Home component */}
        <Route path="/" element={<Home />} />
        {/* When the URL is '/volunteer', show the Volunteer component */}
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