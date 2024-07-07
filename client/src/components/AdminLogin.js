import React, { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://66.29.135.15:5000/admin/auth/signup", {
        username,
        password,
      });
      console.log("Admin signed up successfully");
      // Redirect or show success message
    } catch (error) {
      console.error("Error signing up admin:", error);
      // Display error message
    }
  };

  return (
    <div>
      <h2>Admin Sign Up</h2>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default AdminLogin;
