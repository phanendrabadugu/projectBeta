import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import StudentSearch from "./components/StudentSearch";
import RestaurantForm from "./components/RestaurantForm";
import AdminSignIn from "./components/AdminSignIn";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
// import Services from './Services';
// import Contact from './Contact';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route exact path="/StudentSearch" element={<StudentSearch />} />
          <Route path="/RestaurantForm" element={<RestaurantForm />} />
          <Route path="/admin/signin" element={<AdminSignIn/>} />
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />

          {/* <Route path="/services" component={Services} />
          <Route path="/contact" component={Contact} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
