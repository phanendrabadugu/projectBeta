import React, { useRef, useEffect } from 'react';

const SearchForm = ({ inputAddress, setInputAddress, handleSubmit, distance, handleDistanceChange }) => {
  const autocompleteInput = useRef(null);

  useEffect(() => {
    if (!window.google) return; // Check if google maps API is loaded

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput.current);
    autocomplete.addListener('place_changed', handlePlaceSelect);

    return () => {
      // Clean up listener when component unmounts
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []);

  const handlePlaceSelect = () => {
    if (!autocompleteInput.current || !window.google) return;

    const place = autocompleteInput.current.value;
    setInputAddress(place);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputAddress}
        onChange={(e) => setInputAddress(e.target.value)}
        ref={autocompleteInput}
        placeholder="Enter your address"
      />
      <button type="submit">Search</button>
      <label>
        Filter by distance (km):
        <input
          type="range"
          value={distance}
          onChange={handleDistanceChange}
          min="1"
          max="50"
        />
        <span>{distance} km</span>
      </label>
    </form>
  );
};

export default SearchForm;
