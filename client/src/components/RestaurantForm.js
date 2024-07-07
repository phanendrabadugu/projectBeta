import React, { useState } from 'react';
import axios from 'axios';

const RestaurantForm = () => {
  const initialFormData = {
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    jobPosts: {
      cooking: false,
      delivery: false,
      receptionist: false,
    }
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        jobPosts: {
          ...formData.jobPosts,
          [name]: checked,
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://66.29.135.15:5000/restaurantForm', formData);
      console.log(response.data)
      alert('Restaurant added successfully');
      setFormData(initialFormData); // Reset to initial form structure
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert('Failed to add restaurant');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Street:</label>
        <input type="text" name="street" value={formData.street} onChange={handleChange} required />
      </div>
      <div>
        <label>City:</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
      </div>
      <div>
        <label>State:</label>
        <input type="text" name="state" value={formData.state} onChange={handleChange} required />
      </div>
      <div>
        <label>Zip:</label>
        <input type="text" name="zip" value={formData.zip} onChange={handleChange} required />
      </div>
      <div>
        <label>Job Posts:</label>
        <div>
          <input type="checkbox" name="cooking" checked={formData.jobPosts.cooking} onChange={handleChange} />
          <label>Cooking</label>
        </div>
        <div>
          <input type="checkbox" name="delivery" checked={formData.jobPosts.delivery} onChange={handleChange} />
          <label>Delivery</label>
        </div>
        <div>
          <input type="checkbox" name="receptionist" checked={formData.jobPosts.receptionist} onChange={handleChange} />
          <label>Receptionist</label>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RestaurantForm;
