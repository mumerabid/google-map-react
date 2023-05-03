import { useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerF,
} from "@react-google-maps/api";

export default function MyMapComponent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBdv1XrGqs_hIPfVFvo2IjnBVVa5jIm6JI",
  });

  const mapContainerStyle = useMemo(() => ({
    height: "100vh",
    width: "100vw",
  }));

  const center = useMemo(() => ({
    lat: 40.7128,
    lng: -74.006,
  }));

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <GoogleMap zoom={8} center={center} mapContainerStyle={mapContainerStyle}>
      <MarkerF position={center} />
    </GoogleMap>
  );
}
