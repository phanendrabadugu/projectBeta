import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Select from "react-select";

Modal.setAppElement("#root");

const ApplicationForm = ({ isOpen, onClose, selectedRestaurant, jobPosts }) => {
  const initialFormData = {
    name: "",
    address: "",
    email: "",
    contactDetails: "",
    selectedPositions: [], // Store selected positions as an array
    howLongLooking: "",
    callAvailability: "",
    agreedToPolicy: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (selectedOptions) => {
    const positions = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    console.log("Selected Positions:", positions); // Log selected positions for debugging
    setFormData({
      ...formData,
      selectedPositions: positions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data before submit:", formData); // Log form data for debugging

    try {
      const response = await axios.post(
        "http://localhost:5000/api/submitJobApplication",
        {
          ...formData,
          selectedRestaurantId: selectedRestaurant._id,
        }
      );

      console.log(response.data);
      alert("Application submitted successfully");
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application");
    }
  };

  if (!selectedRestaurant) {
    return null;
  }

  const jobOptions = Object.entries(jobPosts)
    .filter(([role, isAvailable]) => isAvailable)
    .map(([role]) => ({ value: role, label: role }));

  if (jobOptions.length > 2) {
    jobOptions.unshift({
      value: "Available to all posts",
      label: "Available to all posts",
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Application Form Modal"
      style={modalStyles}
    >
      <div style={styles.header}>
        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>
      <div style={styles.formContainer}>
        <h2>Application Form for {selectedRestaurant.address.city}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Contact details:</label>
            <input
              type="text"
              name="contactDetails"
              value={formData.contactDetails}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Available Job Posts:</label>
            <Select
              isMulti
              name="selectedPositions"
              options={jobOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={jobOptions.filter((option) =>
                formData.selectedPositions.includes(option.value)
              )}
              onChange={handleSelectChange}
            />
          </div>
          <div>
            <label>How long looking for work:</label>
            <input
              type="text"
              name="howLongLooking"
              value={formData.howLongLooking}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>When will you be available to take a call:</label>
            <input
              type="text"
              name="callAvailability"
              value={formData.callAvailability}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="agreedToPolicy"
                checked={formData.agreedToPolicy}
                onChange={handleChange}
                required
              />
              I agree to pay 100 euros after the training and to know the
              restaurant details.
            </label>
          </div>
          <button type="submit">Submit Application</button>
        </form>
      </div>
    </Modal>
  );
};

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    maxWidth: "600px",
    maxHeight: "80%",
    overflowY: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "5px",
    position: "absolute",
    top: "10px",
    left: "10px",
  },
  formContainer: {
    padding: "20px",
  },
};

export default ApplicationForm;
