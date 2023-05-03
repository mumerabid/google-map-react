import React from "react";
import MApComp3 from "../components/map/MApComp3";
import { customerslist } from "../data/customerslist";
import { polyData } from "../data/ula_all";
import { popDensityData } from "../data/population_density";
export default function Map() {
  const [markers, setMarkers] = React.useState();
  const [polygons, setPolygons] = React.useState();
  const [heatMap, setHeatMap] = React.useState();
  const [zoom, setZoom] = React.useState();
  const [updateTime, setTime] = React.useState(Date.now());
  React.useEffect(() => {
    // setMarkers(customerslist);
    setZoom(10);
  }, []);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", position: "relative" }}
    >
      <div style={{ width: "100vw", height: "60vh" }}>
        <MApComp3
          zoom={zoom}
          // markers
          markers={markers}
          // polygons
          polygons={polygons}
          // heatmap
          heatmapData={heatMap}
          buildHeatMap={heatMap && Object.keys(heatMap).length}
          center={{
            lat: -1.2500671,
            lng: 36.6845658999999,
          }}
          updateTime={updateTime}
        ></MApComp3>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: 20,
          left: 20,
        }}
      >
        <button
          style={{ marginBottom: "10px" }}
          onClick={() => {
            let markers = {};
            for (let pid in customerslist) {
              let custList = customerslist[pid];
              for (let cust of custList) {
                let { id, name, lat, lng } = cust;
                markers[id] = {
                  data: { id, name },

                  position: {
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                  },
                  // icon: conductedAt,
                  showInfo: false,
                };
              }
            }

            setMarkers(markers);
          }}
        >
          Show Customers
        </button>
        <button
          style={{ marginBottom: "10px" }}
          onClick={() => {
            setMarkers({});
          }}
        >
          Hide Customers
        </button>
        <button
          style={{ marginBottom: "10px" }}
          onClick={() => {
            let tPolygons = {};
            const ids = Object.keys(polyData.nairobi.locations);
            // console.log(ids);
            ids.forEach((id, indx) => {
              // console.log(polyData.nairobi.locations[id]);
              const pdata = polyData.nairobi.locations[id];

              let poly = {
                id: pdata._id,
                coordinates: pdata.boundary.polygon,
                strokeColor: pdata.boundary.style.fillColor,

                // showInfo: true,
              };
              tPolygons[indx] = poly;
              // console.log("poly: ", poly);
            });
            setPolygons(tPolygons);
            // console.log(tPolygons);
          }}
        >
          Show Polygon
        </button>
        <button
          style={{ marginBottom: "10px" }}
          onClick={() => {
            setPolygons({});
          }}
        >
          Hide Polygon
        </button>
        <button
          style={{ marginBottom: "10px" }}
          onClick={() => {
            let theatmap = {};
            let count = 0;
            for (const point of popDensityData) {
              let { coordinates, population } = point;
              let polygon = {
                marker: { position: coordinates[0] },
                data: { weight: population },
                showInfo: false,
              };
              theatmap[count++] = polygon;
            }
            console.log(theatmap);
            setTime(Date.now());
            setHeatMap(theatmap);
          }}
        >
          Show HeatMap
        </button>
        <button
          style={{ marginBottom: "10px" }}
          onClick={() => {
            setHeatMap({});
          }}
        >
          Hide HeatMap
        </button>
      </div>
    </div>
  );
}
