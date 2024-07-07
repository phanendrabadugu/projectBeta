import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav >
      <div >
        
        <ul id="nav-mobile" style={{display:'flex', justifyContent: "center"} } className="right hide-on-med-and-down">
          <li><Link to="/studentSearch">Search A Job</Link></li>
          <li><Link to="/restaurantForm">Create A Job</Link></li>
          {/* <li><Link to="/admin/signin">Sign In</Link></li>
          <li><Link to="/admin/login">Login</Link></li>
          <li><Link to="/admin/dashboard">Dashboard</Link></li> */}
          {/* <li><Link to="/services">Services</Link></li>
          <li><Link to="/contact">Contact</Link></li> */}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
