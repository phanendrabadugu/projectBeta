import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MapComponent from './Mapcomponent';
import SearchForm from './SearchForm';
import RestaurantList from './RestaurantList';

const geocodeAddress = async (address) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAIyY4C-OPivpAncytCELY-fUCk9aJsDWc`);
  const location = response.data.results[0].geometry.location;
  return location;
};

const StudentSearch = () => {
  const [inputAddress, setInputAddress] = useState('');
  const [nearbyAddresses, setNearbyAddresses] = useState([]);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [distance, setDistance] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const restaurantListRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (restaurantListRef.current && nearbyAddresses.length > 0) {
        const mapComponent = document.querySelector('#mapComponent');
        if (mapComponent) {
          mapComponent.style.height = `${restaurantListRef.current.clientHeight}px`;
        }
      }
    };

    handleResize();
    console.log("rendered from ss");

    window.addEventListener('resize', handleResize, { passive: true });

    return () => window.removeEventListener('resize', handleResize);
  }, [nearbyAddresses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const location = await geocodeAddress(inputAddress);
      setLocation(location);
      fetchNearbyAddresses(location.lat, location.lng, distance);
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
    setLoading(false);
  };

  const fetchNearbyAddresses = async (lat, lng, distance) => {
    try {
      const response = await axios.get('http://66.29.135.15:5000/studentSearch', {
        params: { lat, lng, distance }
      });
      setNearbyAddresses(response.data);
    } catch (error) {
      console.error('Error fetching nearby addresses:', error);
    }
  };

  const handleDistanceChange = async (e) => {
    const newDistance = e.target.value;
    setDistance(newDistance);
    if (location.lat && location.lng) {
      fetchNearbyAddresses(location.lat, location.lng, newDistance);
    }
  };
console.log("location",location)
console.log("NBA",nearbyAddresses)
  return (
    <div>
      <h1>Find Nearby Restaurants</h1>
      <SearchForm
        inputAddress={inputAddress}
        setInputAddress={setInputAddress}
        handleSubmit={handleSubmit}
        distance={distance}
        handleDistanceChange={handleDistanceChange}
      />
      {loading && <p>Loading...</p>}
      <div style={styles.container}>
        <div style={styles.leftPane} ref={restaurantListRef}>
          <RestaurantList addresses={nearbyAddresses} setSelectedRestaurant={setSelectedRestaurant} />
        </div>
        {nearbyAddresses.length > 0 && (
          <div id="mapComponent" style={styles.rightPane}>
            <MapComponent
              initialAddresses={nearbyAddresses}
              distance={distance}
              center={location}
              selectedRestaurant={selectedRestaurant}
              setSelectedRestaurant={setSelectedRestaurant}
              inputAddress={location}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftPane: {
    flex: 1,
    padding: '20px',
    marginRight: '10px',
    overflow: 'auto',
  },
  rightPane: {
    flex:2,
    padding: '20px',
    marginLeft: '10px',
    overflow: 'hidden',
  },
};

export default StudentSearch;
