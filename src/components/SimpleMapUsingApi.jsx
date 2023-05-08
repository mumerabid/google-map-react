import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindowF,
  MarkerClustererF,
  MarkerF,
  PolygonF,
  useLoadScript,
} from "@react-google-maps/api";
import { polyData } from "../data/data";
export default function SimpleMapUsingApi() {
  const [mapCenter, setMapCenter] = useState({
    lng: 67.0456963761744,
    lat: 24.9196692175783,
  }); // [1]
  const [markers, setMarkers] = useState([
    { lat: 30.3753, lng: 69.3451, time: 1 },
    { lat: 30.3753, lng: 69.3452, time: 2 },
    { lat: 30.3753, lng: 69.3453, time: 3 },
    // litte far away
    { lat: 30.3753, lng: 69.3454, time: 4 },
    { lat: 30.3753, lng: 69.3455, time: 5 },
    { lat: 30.3753, lng: 69.3456, time: 6 },
  ]); // [2]
  var myInfoWindow;
  //
  const [showMarker, setShowMarker] = useState(false);
  const [cInfoWindowData, setCInfoWindowData] = useState({
    show: false,
    cor: { lat: 0, lng: 0 },
    name: "",
  });

  //
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "",
    libraries: ["visualization"],
  });

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <GoogleMap
        mapContainerStyle={{ width: "100vw", height: "100vh" }}
        zoom={10}
        center={mapCenter}
        //print zoom level
        onLoad={(map) => {
          window.google.maps.event.addListener(map, "zoom_changed", () =>
            console.log(map.getZoom())
          );
          window.google.maps.event.addListener(map, "mouseover", () =>
            console.log(map.getZoom())
          );
        }}
      >
        {/* Show a marker when the button is clicked */}
        {showMarker && (
          <MarkerClustererF
            options={{
              imagePath:
                "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            }}
          >
            {(clusterer) =>
              markers.map((marker) => (
                <MarkerF
                  key={marker.time}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  clusterer={clusterer}
                />
              ))
            }
          </MarkerClustererF>
        )}
        {polyData?.map((poly, index) => (
          <PolygonF
            key={index}
            onLoad={(polygon) => {
              new window.google.maps.event.addListener(
                polygon,
                "mouseover",
                () => {
                  console.log("poly data: ", poly.name);
                  setCInfoWindowData({
                    show: true,
                    cor: {
                      lat: poly.coordinates[0].lat,
                      lng: poly.coordinates[0].lng,
                    },
                    name: poly.name,
                  });
                }
              );
              new window.google.maps.event.addListener(
                polygon,
                "mouseout",
                () => {
                  setCInfoWindowData({
                    show: false,
                  });
                }
              );
            }}
            path={poly.coordinates}
            options={{
              fillColor: "lightblue",
              fillOpacity: 0.4,
              strokeColor: "grey",
              strokeOpacity: 1,
              strokeWeight: 1,
            }}
          ></PolygonF>
        ))}
        {cInfoWindowData?.show && (
          <InfoWindowF
            position={{
              lat: cInfoWindowData.cor.lat,
              lng: cInfoWindowData.cor.lng,
            }}
            onLoad={(marker) => {}}
            options={{
              disableAutoPan: true,
              // disableAutoPan: true added a border around the info window remove it
            }}
            style={{
              boxShadow: "none",
            }}
          >
            <div
              style={{
                borderColor: "green",
                backgroundColor: "white",
                zIndex: 2,
              }}
            >
              <p>{cInfoWindowData.name}</p>
            </div>
          </InfoWindowF>
        )}
        <PolygonF
          onLoad={(polygon) => {
            new window.google.maps.event.addListener(
              polygon,
              "mouseover",
              () => {
                console.log("in lahore");
                // add info window here
                myInfoWindow = new window.google.maps.InfoWindow({
                  content: "Lahore",
                  position: { lat: 31.582045, lng: 74.329376 },
                }).open(polygon.getMap());
              }
            );
            new window.google.maps.event.addListener(
              polygon,
              "mouseout",
              () => {
                console.log("out of lahore");

                //console the lat and lng of the of current mouse position
                console.log(myInfoWindow);
                // add info window here
                // new window.google.maps.InfoWindow({
                //   content: "Lahore",
                //   position: { lat: 31.582045, lng: 74.329376 },
                // }).close(polygon.getMap());
              }
            );
          }}
          paths={[
            { lat: 31.582045, lng: 74.329376 },
            { lat: 31.582309, lng: 74.304382 },
            { lat: 31.576246, lng: 74.291952 },
            { lat: 31.563352, lng: 74.283653 },
            { lat: 31.541913, lng: 74.292669 },
            { lat: 31.532973, lng: 74.30911 },
            { lat: 31.531459, lng: 74.322451 },
            { lat: 31.536074, lng: 74.338037 },
            { lat: 31.553595, lng: 74.352771 },
            { lat: 31.57194, lng: 74.357738 },
            { lat: 31.590008, lng: 74.352857 },
            { lat: 31.59866, lng: 74.334129 },
            { lat: 31.597612, lng: 74.317756 },
            { lat: 31.588963, lng: 74.302822 },
            { lat: 31.582045, lng: 74.329376 },
          ]}
          options={{
            fillColor: "#FF0000",
            fillOpacity: 0.4,
            strokeColor: "#FF0000",
            strokeOpacity: 1,
            strokeWeight: 1,
            clickable: true,
            geodesic: false,
            zIndex: 1,
          }}
          onDragEnd={(e) => {
            console.log("polygon drag end: ", e);
          }}
        ></PolygonF>
        {/* Show a button in the center of the map*/}
        <button
          style={{
            position: "absolute",
            bottom: "8%",
            left: "5%",
            zIndex: "100",
          }}
          onClick={() => {
            setShowMarker(!showMarker);
          }}
        >
          Show Marker
        </button>
      </GoogleMap>
    </div>
  );
}
