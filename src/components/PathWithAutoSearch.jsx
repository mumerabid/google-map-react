import React, { useEffect, useRef, useState } from "react";
import {
  useLoadScript,
  Autocomplete,
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
  MarkerF,
} from "@react-google-maps/api";

function SearchBox({ onPlaceChanged, autocompleteRef }) {
  const handleLoad = (auto) => {
    autocompleteRef.current = auto;
  };

  return (
    <Autocomplete onLoad={handleLoad} onPlaceChanged={onPlaceChanged}>
      <input
        type="text"
        placeholder="Location 1"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
          position: "absolute",
          left: "50%",
          marginLeft: "-120px",
        }}
      />
    </Autocomplete>
  );
}

function SearchBox2({ onPlaceChanged, autocompleteRef }) {
  const handleLoad = (auto) => {
    autocompleteRef.current = auto;
  };

  return (
    <Autocomplete onLoad={handleLoad} onPlaceChanged={onPlaceChanged}>
      <input
        type="text"
        placeholder="Location 2"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
          position: "absolute",
          left: "50%",
          top: "40px",
          marginLeft: "-120px",
        }}
      />
    </Autocomplete>
  );
}

export default function PathWithAutoSearch() {
  const [location1, setLocation1] = useState(null);
  const [location2, setLocation2] = useState(null);
  const [directions, setDirections] = useState(null);

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const autocompleteRef2 = useRef(null);

  useEffect(() => {
    if (location1 && location2) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: location1,
          destination: location2,
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          }
        }
      );
    }
  }, [location1, location2]);

  const handlePlaceChanged = () => {
    const place1 = autocompleteRef.current.getPlace();
    const place2 = autocompleteRef2.current.getPlace();

    if (place1 && place1.geometry) {
      setLocation1({
        lat: place1.geometry.location.lat(),
        lng: place1.geometry.location.lng(),
      });
    }

    if (place2 && place2.geometry) {
      setLocation2({
        lat: place2.geometry.location.lat(),
        lng: place2.geometry.location.lng(),
      });
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "",
    libraries: ["places"],
  });

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  const mapContainerStyle = {
    height: "100vh",
    width: "100vw",
  };
  const center = {
    lat: 40.7128,
    lng: -74.006,
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={center}
      onLoad={(map) => (mapRef.current = map)}
    >
      <SearchBox
        onPlaceChanged={handlePlaceChanged}
        autocompleteRef={autocompleteRef}
      />
      <SearchBox2
        onPlaceChanged={handlePlaceChanged}
        autocompleteRef={autocompleteRef2}
      />
      {directions && (
        <DirectionsRenderer directions={directions} map={mapRef.current} />
      )}
      {location1 && (
        <MarkerF
          position={location1}
          //
        />
      )}
      {location2 && <MarkerF position={location2} />}
      {/* {location1 && (
        <InfoWindow position={location1}>
          <div>Location 1</div>
        </InfoWindow>
      )}
      {location2 && (
        <InfoWindow position={location2}>
          <div>Location 2</div>
        </InfoWindow>
      )} */}
    </GoogleMap>
  );
}
