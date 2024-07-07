import React, { useEffect, useState, useRef} from 'react';
import { GoogleMap, useJsApiLoader, Circle, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';


const containerStyle = {
  width: '100%',
  height: '100%',
};

const DEFAULT_RADIUS_METERS = 2000;
const MAP_ZOOM_LEVEL = 10;

const calculateCenter = (addresses) => {
  if (!addresses || addresses.length === 0) {
    return { lat: 0, lng: 0 };
  }

  const total = addresses.reduce(
    (acc, address) => {
      acc.lat += address.address.location.coordinates[1];
      acc.lng += address.address.location.coordinates[0];
      return acc;
    },
    { lat: 0, lng: 0 }
  );

  return {
    lat: total.lat / addresses.length,
    lng: total.lng / addresses.length,
  };
};




const MapComponent = ({ initialAddresses, selectedRestaurant, setSelectedRestaurant, distance, inputAddress }) => {
  const [updatedAddresses, setUpdatedAddresses] = useState([]);
  const [travelTime, setTravelTime] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    if (initialAddresses && initialAddresses.length > 0) {
      setUpdatedAddresses(initialAddresses);
    }
  }, [initialAddresses]);

  useEffect(() => {
    if (selectedRestaurant && mapRef.current) {
      mapRef.current.panTo({
        lat: selectedRestaurant.address.location.coordinates[1],
        lng: selectedRestaurant.address.location.coordinates[0],
      });
    }
  }, [selectedRestaurant]);

// console.log("destination", selectedRestaurant.address.location.coordinates[1],
//   selectedRestaurant.address.location.coordinates[0])
//   console.log("origin",inputAddress.lat,inputAddress.lng)

  

  useEffect(() => {
    const getTravelTime = async () => {
      if (!selectedRestaurant || !inputAddress) return;

      const origin = `${inputAddress.lat},${inputAddress.lng}`;
      const destination = `${selectedRestaurant.address.location.coordinates[1]},${selectedRestaurant.address.location.coordinates[0]}`;
      const apiKey = 'AIzaSyAIyY4C-OPivpAncytCELY-fUCk9aJsDWc';
      
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}&mode=driving`;

      try {
        const response = await axios.get(url);
        const duration = response.data.rows[0].elements[0].duration.text;
        setTravelTime(duration);
      } catch (error) {
        console.error('Error fetching travel time:', error);
        setTravelTime('');
      }
    };

    getTravelTime();
  }, [selectedRestaurant,inputAddress]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAIyY4C-OPivpAncytCELY-fUCk9aJsDWc',
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const regionCenter = calculateCenter(updatedAddresses);
  const regionRadius = DEFAULT_RADIUS_METERS;

 console.log("selectedResto", selectedRestaurant)
 

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={regionCenter}
      zoom={MAP_ZOOM_LEVEL}
      onLoad={(map) => (mapRef.current = map)}
    >
      {updatedAddresses.map((address, index) => (
        <Circle
          key={index}
          center={{ lat: address.address.location.coordinates[1], lng: address.address.location.coordinates[0] }}
          radius={regionRadius}
          options={{
            fillColor: 'blue',
            fillOpacity: address === selectedRestaurant ? 0.5 : 0.2,
            strokeColor: 'blue',
            strokeOpacity: 0.5,
            strokeWeight: 1,
          }}
          onClick={() => setSelectedRestaurant(address)}
        />
      ))}
      {selectedRestaurant && (
        <InfoWindow
          position={{
            lat: selectedRestaurant.address.location.coordinates[1],
            lng: selectedRestaurant.address.location.coordinates[0],
          }}
          onCloseClick={() => setSelectedRestaurant(null)}
        >
          <div>
            {/* <h4>{selectedRestaurant.name}</h4>
            <p>{selectedRestaurant.address.street}, {selectedRestaurant.address.city}</p> */}
            <h1>Travel Time By Driving: {travelTime}</h1>
            {/* <h4>{selectedRestaurant.address.state} - {selectedRestaurant.address.zip}</h4>
            
            <h4>Job Posts: {Object.keys(selectedRestaurant.jobPosts).filter(role => selectedRestaurant.jobPosts[role]).join(', ')}</h4> */}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapComponent;
