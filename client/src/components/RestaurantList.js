import React, { useState } from 'react';
import Modal from 'react-modal';
import ApplicationForm from './ApplicationForm';
import JobPosts from './JobPosts';
Modal.setAppElement('#root');

const RestaurantList = ({ addresses }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSelectRestaurant = (address) => {
    setSelectedRestaurant(address);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedRestaurant(null);
  };

  return (
    <div style={styles.listContainer}>
      <ul style={styles.list}>
        {addresses.map((address, index) => (
          <li
            key={index}
            onClick={() => handleSelectRestaurant(address)}
            style={styles.addressContainer}
          >
            <h1 style={styles.city}>{address.address.city}</h1>
            <div style={styles.jobPosts}>
              <JobPosts jobPosts={address.jobPosts} />
            </div>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={isFormOpen}
        onRequestClose={handleCloseForm}
        contentLabel="Application Form Modal"
        style={modalStyles}
      >
        <ApplicationForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          selectedRestaurant={selectedRestaurant}
          jobPosts={selectedRestaurant ? selectedRestaurant.jobPosts : {}}
        />
      </Modal>
    </div>
  );
};

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '600px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
};

const styles = {
  listContainer: {
    height: '800px',
    overflowY: 'auto',
    border: '1px solid #ccc',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  addressContainer: {
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  city: {
    marginBottom: '5px',
  },
  jobPosts: {
    marginLeft: '20px',
  },
};

export default RestaurantList;
