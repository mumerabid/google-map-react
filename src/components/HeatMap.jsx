import { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  HeatmapLayerF,
  Autocomplete,
} from "@react-google-maps/api";
import { heatmapData } from "./heatmapdata";

export default function HeatMap() {
  const [greenData, setGreenData] = useState([]);
  const [redData, setRedData] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "",
    libraries: ["visualization"],
  });

  useEffect(() => {
    const newGreenData = [];
    const newRedData = [];

    heatmapData.forEach((item) => {
      const { coordinates, population } = item;

      coordinates.forEach((coord) => {
        const { lat, lng } = coord;

        if (population > 10) {
          newGreenData.push({ lat, lng });
        } else {
          newRedData.push({ lat, lng });
        }
      });
    });

    setGreenData(newGreenData);
    setRedData(newRedData);
  }, []);

  const mapContainerStyle = useMemo(() => ({
    height: "100vh",
    width: "100vw",
  }));

  const center = {
    lng: 68.44166666666666,
    lat: 24.408333333034868,
  };

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div style={{ display: "flex", flexDirection: "row", marginTop: "50px" }}>
      <div style={{ marginRight: "50px" }}>
        <GoogleMap
          mapContainerStyle={{ width: "40vw", height: "80vh" }}
          zoom={8}
          center={center}
          options={{
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            scrollwheel: false,
            draggable: false,
          }}
        >
          {greenData.length > 0 && (
            <HeatmapLayerF
              data={greenData.map((item) => {
                const { lat, lng } = item;
                return new window.google.maps.LatLng(lat, lng);
              })}
              options={{
                gradient: ["rgba(0, 255, 0, 0)", "rgba(0, 255, 0, 1)"],
                opacity: 0.6,
              }}
            />
          )}

          {redData.length > 0 && (
            <HeatmapLayerF
              data={redData.map((item) => {
                const { lat, lng } = item;
                return new window.google.maps.LatLng(lat, lng);
              })}
              options={{
                gradient: ["rgba(255, 0, 0, 0)", "rgba(255, 0, 0, 1)"],
                opacity: 0.6,
              }}
            />
          )}
        </GoogleMap>
      </div>
      <div>
        <GoogleMap
          mapContainerStyle={{ width: "40vw", height: "80vh" }}
          zoom={8}
          center={center}
        >
          {greenData.length > 0 && (
            <HeatmapLayerF
              data={greenData.map((item) => {
                const { lat, lng } = item;
                return new window.google.maps.LatLng(lat, lng);
              })}
              options={{
                gradient: ["rgba(0, 255, 0, 0)", "rgba(0, 255, 0, 1)"],
                opacity: 0.6,
              }}
            />
          )}

          {redData.length > 0 && (
            <HeatmapLayerF
              data={redData.map((item) => {
                const { lat, lng } = item;
                return new window.google.maps.LatLng(lat, lng);
              })}
              options={{
                gradient: ["rgba(255, 0, 0, 0)", "rgba(255, 0, 0, 1)"],
                opacity: 0.6,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
