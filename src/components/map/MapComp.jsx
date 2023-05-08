import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindowF,
  Marker,
  MarkerClustererF,
  MarkerF,
  PolygonF,
  useLoadScript,
} from "@react-google-maps/api";
// import { loadJsonFile } from "load-json-file";
import { customerslist } from "../../data/customerslist";
import { polyData } from "../../data/ula_all";
import popDensityData from "../../data/population_density";
import MarkerClusterer from "@googlemaps/markerclustererplus";

export default function MapComp({}) {
  var tempMap;
  var tempMarker = [];
  var tempCluster;
  var tempPolygon = [];
  var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];

  const [selectedKeys, setSelectedKeys] = useState(["polygons"]);
  // console.log("selectedKeys in comp", selectedKeys);
  const [mapCenter, setMapCenter] = useState({
    lng: 67.0456963761744,
    lat: 24.9196692175783,
  });

  const [customerslistData, setCustomerslistData] = useState([]);
  const [finalCustomerslist, setFinalCustomerslist] = useState([]);
  //
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "",
    libraries: ["visualization"],
  });
  useEffect(() => {
    console.log("selectedKeys", selectedKeys);
    let dataArr = [customerslist];
    setCustomerslistData(dataArr);
  }, []);

  useEffect(() => {
    // console.log("customerslist", customerslistData);
    const data = [];
    customerslistData.map((customer) => {
      // console.log("customer", customer);
      const keys = Object.keys(customer);
      // console.log("keys", keys);
      keys.map((key) => {
        const singleKeyData = customer[key];
        const result = singleKeyData.reduce((acc, curr) => {
          // add the key to the accumulator object
          return [...acc, { ...curr, key: key }];
        }, []);
        // console.log("singleKey data", result);
        data.push(...result);
      });
    });
    // console.log("data", data);

    setFinalCustomerslist(data);
  }, [customerslistData]);

  useEffect(() => {
    setMapCenter({
      lat: finalCustomerslist[0]?.lat ? finalCustomerslist[0]?.lat : 0,
      lng: finalCustomerslist[0]?.lng ? finalCustomerslist[0]?.lng : 0,
    });
    console.log("finalCustomerslist", finalCustomerslist);
  }, [finalCustomerslist]);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <GoogleMap
        mapContainerStyle={{ width: "100vw", height: "100vh" }}
        zoom={10}
        center={mapCenter}
        //print zoom level
        onBoundsChanged={() => {
          // when onBoundsChanged is called?
          // when zoom level is changed
          // when map is dragged
          // when map is resized
        }}
        onLoad={(map) => {
          tempMap = map;

          // finalCustomerslist.map((customer) => {
          //   // console.log("customer", customer);
          //   const marker = new window.google.maps.Marker({
          //     position: { lat: customer.lat, lng: customer.lng },
          //     map,
          //     title: customer.key,
          //   });
          // marker.setVisible(false);
          // tempMarker.push(marker);
          // console.log("marker", marker);
          // });
          // now create cluster of markers
          // tempCluster = new MarkerClusterer(map, tempMarker, {
          //   imagePath:
          //     "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
          // });
          // hide the marker clusterer
          // tempCluster.setMap(null);

          // show the marker clusterer
          // tempCluster.setMap(map);
          // tempCluster?.marker_?.map((marker) => {
          //   marker.setVisible(false);
          // });
          // tempCluster
          // set the cluster to hide initially
          // tempCluster.setMap(null);
          // console.log("markerCluster", tempCluster);

          console.log("map", "loaded");
          window.google.maps.event.addListener(map, "zoom_changed", () =>
            console.log(map.getZoom())
          );
          window.google.maps.event.addListener(map, "mouseover", () =>
            console.log(map.getZoom())
          );
          window.google.maps.event.addListener(map, "click", (e) =>
            console.log(e)
          );
        }}
      >
        {selectedKeys[0] === "pins" && (
          <MarkerClustererF
            options={{
              imagePath:
                "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            }}
          >
            {(clusterer) =>
              finalCustomerslist.map((customer) => (
                <MarkerF
                  onClick={() => {
                    console.log("marker data: ", customer);
                  }}
                  key={customer.id}
                  position={{ lat: customer.lat, lng: customer.lng }}
                  clusterer={clusterer}
                ></MarkerF>
              ))
            }
          </MarkerClustererF>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 160,
            right: 20,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button style={{ marginBottom: 10 }} onClick={() => {}}>
            Show Heatmap
          </button>
          <button
            style={{ marginBottom: 10 }}
            onClick={() => {
              finalCustomerslist?.map((customer) => {
                let marker = new window.google.maps.Marker({
                  position: { lat: customer.lat, lng: customer.lng },
                  map: tempMap,
                  title: customer.key,
                  // change the icon to red
                  // icon: {
                  //   url: "http://maps.google.com/mapfiles/ms/icons/red.png",
                  // },
                });
                marker.addListener("click", function () {
                  // code to execute when marker is clicked
                  console.log("marker data: ", customer);
                });
                tempMarker.push(marker);
              });
              tempCluster = new MarkerClusterer(tempMap, tempMarker, {
                imagePath:
                  "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
              });
              tempCluster.setMap(tempMap);

              // add the markers
              // tempMarker?.map((marker) => {
              //   marker.setVisible(true);
              // });
              // console.log("tempCluster", tempCluster);
            }}
          >
            Add Pins
          </button>

          <button
            style={{ marginBottom: 10 }}
            onClick={() => {
              // remove the  markers
              // tempMarker?.map((marker) => {
              //   marker.setVisible(false);
              // });

              tempMarker?.map((marker) => {
                marker.setMap(null);
              });

              // remove the cluster
              // tempCluster?.clearMarkers();

              // remove cluster and markers

              if (tempMarker?.length > 0)
                tempCluster?.removeMarkers(tempMarker);
              // tempCluster = null;
              tempMarker = [];
            }}
          >
            remove Pins
          </button>
          <button
            style={{
              marginBottom: 10,
            }}
            onClick={() => {
              // console.log("poly", polyData.nairobi.locations);
              // console.log("poly", Object.keys(polyData.nairobi.locations));
              let keys = Object.keys(polyData?.nairobi?.locations);
              keys.forEach((key) => {
                // console.log("key data", polyData?.nairobi?.locations[key]);
                console.log(
                  "polygon data",
                  polyData?.nairobi?.locations[key]?.boundary?.polygon
                );
                let polygon = new window.google.maps.Polygon({
                  paths: polyData?.nairobi?.locations[key]?.boundary?.polygon,
                  strokeColor: "black",
                  strokeOpacity: 0.8,
                  strokeWeight: 1,
                  fillColor: "#FF0000",
                  fillOpacity: 0.35,
                });
                polygon?.addListener("click", function () {
                  // code to execute when marker is clicked
                  console.log(
                    "polygon data: ",
                    polyData?.nairobi?.locations[key]
                  );
                });
                tempPolygon.push(polygon);
                polygon.setMap(tempMap);
              });
            }}
          >
            Add Polygons
          </button>
          <button
            onClick={() => {
              // remove polygons
              tempPolygon?.map((polygon) => {
                polygon.setMap(null);
              });
              tempPolygon = [];
            }}
          >
            Remove Polygons
          </button>
        </div>
      </GoogleMap>
    </div>
  );
}
