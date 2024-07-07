import React, { useState } from "react";
import axios from "axios";

const AdminSignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://66.29.135.15:5000/admin/auth/login", {
        username,
        password,
      });
      localStorage.setItem("adminToken", response.data.token);
      console.log("Admin signed in successfully");
      // Redirect or show success message
    } catch (error) {
      console.error("Error signing in admin:", error);
      // Display error message
    }
  };

  return (
    <div>
      <h2>Admin Sign In</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default AdminSignIn;
