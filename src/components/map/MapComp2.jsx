import React from "react";
import GoogleMapReact from "google-map-react";

const MapComp2 = () => {
  const Marker = () => <div className="marker">📍</div>;
  const center = { lat: 59.95, lng: 30.33 };
  const zoom = 11;

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        <Marker lat={center.lat} lng={center.lng} />
      </GoogleMapReact>
    </div>
  );
};

export default MapComp2;
