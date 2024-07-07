import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [jobApplications, setJobApplications] = useState([]);

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const response = await axios.get("http://66.29.135.15:5000/api/admin/dashboard");
        setJobApplications(response.data);
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    fetchJobApplications();
  }, []);

  return (
    <div className="admin-dashboard" style={styles.dashboard}>
      <h2 style={styles.heading}>Job Applications</h2>
      {jobApplications.map((application) => (
        <div key={application._id} style={styles.card}>
          <h3 style={styles.cardHeading}>{application.name}</h3>
          <p><strong>Email:</strong> {application.email}</p>
          <p><strong>Address:</strong> {application.address}</p>
          <p><strong>How long looking:</strong> {application.howLongLooking}</p>
          <p><strong>Contact details:</strong> {application.contactDetails}</p>
          <p><strong>Call availability:</strong> {application.callAvailability}</p>
          <p><strong>Agreed to policy:</strong> {application.agreedToPolicy ? "Yes" : "No"}</p>
          <p><strong>Selected positions:</strong> {application.selectedPositions.join(", ")}</p>
          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
};

const styles = {
  dashboard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  heading: {
    marginBottom: "20px",
    color: "#333",
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "300px",
    marginBottom: "20px",
  },
  cardHeading: {
    marginBottom: "10px",
    fontSize: "1.5rem",
  },
};

export default AdminDashboard;
