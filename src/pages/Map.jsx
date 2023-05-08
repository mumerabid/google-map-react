import React from "react";
import MApComp3 from "../components/map/MApComp3";
import { customerslist } from "../data/customerslist";
import { polyData } from "../data/ula_all";
import { popDensityData } from "../data/population_density";
import { multiheatMapData } from "../data/sec_density";
import { Slider } from "antd";
import { Button } from "antd";
import PolygonDetailsModal from "../components/PolygonDetailsModal";

const C2 = [
  "rgba(255, 255, 0, 0)",
  "rgba(255, 0, 0, 1)",
  "rgba(225, 0, 0, 1)",
  "rgba(200, 0, 0, 1)",
  "rgba(175, 0, 0, 1)",
  "rgba(150, 0, 0, 1)",
];

const C1 = [
  "rgba(255, 255, 0, 0)",
  "rgba(255, 255, 0, 1)",
  "rgba(225, 225, 0, 1)",
  "rgba(200, 200, 0, 1)",
  "rgba(175, 175, 0, 1)",
  "rgba(150, 150, 0, 1)",
];

const AB = [
  "rgba(255, 255, 0, 0)",
  "rgba(0, 255, 0, 1)",
  "rgba(0, 225, 0, 1)",
  "rgba(0, 200, 0, 1)",
  "rgba(0, 175, 0, 1)",
  "rgba(0, 150, 0, 1)",
];
const secToGradient = {
  AB,
  C1,
  C2,
};
export default function Map() {
  console.log("env", process.env.GOOGLE_MAPS_API_KEY);
  const [colors, setColors] = React.useState([
    "#00ff00",
    "#dce775",
    "#ffff00",
    "#ff7f00",
    "#ff0000",
  ]);
  const [sliderData, setSliderData] = React.useState({
    min: undefined,
    max: undefined,
    slider1Mark: {
      0: 0,
      25: 25,
      50: 50,
      75: 75,
      100: 100,
    },
    slider2Array: [],
  });
  const [markers, setMarkers] = React.useState();
  const [polygons, setPolygons] = React.useState();

  const [heatMap, setHeatMap] = React.useState();
  const [zoom, setZoom] = React.useState();
  const [updateTime, setTime] = React.useState(Date.now());
  const [multiHeatmaps, setMultiHeatmaps] = React.useState(false);

  const [polygonFlag, setPolygonFlag] = React.useState(false);
  const [customerFlag, setCustomerFlag] = React.useState(false);

  const [polygonModalFalag, setPolygonModalFalag] = React.useState(false);
  const [selectedPolygonId, setSelectedPolygonId] = React.useState();

  const [selectedPolygonArr, setSelectedPolygonArr] = React.useState([]);

  React.useEffect(() => {
    let marks = {};
    const locations = polyData.nairobi.locations;
    let keys = Object.keys(locations);
    let populationArray = [];
    keys?.forEach((key) => {
      // console.log("key data: ", locations[key]?.data?.population);
      populationArray.push(locations[key]?.data?.population);
    });
    let min = Math.min(...populationArray);
    let max = Math.max(...populationArray);

    setSliderData({
      ...sliderData,
      min,
      max,
      slider1Mark: {
        [min]: min,
        [min + (max - min) / 4]: min + (max - min) / 4,
        [min + ((max - min) / 4) * 2]: min + ((max - min) / 4) * 2,
        [min + ((max - min) / 4) * 3]: min + ((max - min) / 4) * 3,
        [max]: max,
      },
    });

    // console.log("sliderData: ", sliderData);
  }, [polygonFlag]);

  React.useEffect(() => {
    if (customerFlag) {
      // console.log("i need to update the customers: ", customerFlag);
      let markers = {};
      for (let pid in customerslist) {
        if (selectedPolygonArr.includes(pid)) {
          let custList = customerslist[pid];
          for (let cust of custList) {
            let { id, name, lat, lng } = cust;
            // console.log("cust id: ", id);
            // console.log("res: ", selectedPolygonArr.includes(id));
            markers[id] = {
              data: { id, name },

              position: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
              },
              // icon: conductedAt,
              showInfo: true,
            };
          }
        }
      }

      setMarkers(markers);
    }
  }, [selectedPolygonArr]);

  return (
    <div
      className=""
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <div className="w-100">
        <div className="bg-dark text-white text-center fw-bold p-2 mb-1">
          Google Maps Practice
        </div>
        {/* <div>
          slider
        </div> */}
      </div>
      <div className="col-12">
        <div className="">
          <div
            className="position-relative"
            style={{
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            {polygonFlag && sliderData?.max && (
              <div
                style={{
                  backgroundColor: "#e6e6e6e6",
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // borderTop: "20px solid #e6e6e6e6",
                  // borderRight: "25px solid #e6e6e6e6",
                  // borderLeft: "20px solid #e6e6e6e6",
                  // borderBottom: "10px solid #e6e6e6e6",
                  // borderRadius: "5px",
                  zIndex: 100,
                  // backgroundColor to transparent blue color
                  backgroundColor: "rgba(135, 209, 255, 0.06)",
                  height: "80px",
                }}
              >
                <Slider
                  marks={sliderData?.slider1Mark}
                  defaultValue={[sliderData.min, sliderData.max]}
                  range={true}
                  // dots={true}
                  max={sliderData.max}
                  min={sliderData.min}
                  style={{
                    // width: "90vw",
                    width: "95%",
                    position: "absolute",
                    top: 20,
                    zIndex: 100,
                    alignSelf: "center",
                    // display: "flex",
                    // justifyContent: "center",
                  }}
                  onChange={(value) => {
                    if (polygonFlag) {
                      let tPolygons = {};
                      setSelectedPolygonArr([]);
                      const ids = Object.keys(polyData.nairobi.locations);
                      // console.log(ids);
                      ids.forEach((id, indx) => {
                        // console.log(polyData.nairobi.locations[id]);
                        const pdata = polyData.nairobi.locations[id];
                        const population = pdata.data.population;
                        // console.log("population: ", population);
                        let populationColor = "white";
                        const scaledArray = [
                          sliderData.min,
                          (sliderData.max - sliderData.min) / 4 +
                            sliderData.min,
                          ((sliderData.max - sliderData.min) / 4) * 2 +
                            sliderData.min,
                          ((sliderData.max - sliderData.min) / 4) * 3 +
                            sliderData.min,
                          sliderData.max,
                        ];
                        if (population >= value[0] && population <= value[1]) {
                          if (population < scaledArray[1]) {
                            populationColor = colors[0];
                          } else if (population < scaledArray[2]) {
                            populationColor = colors[1];
                          } else if (population < scaledArray[3]) {
                            populationColor = colors[2];
                          } else if (population < scaledArray[4]) {
                            populationColor = colors[3];
                          } else {
                            populationColor = colors[4];
                          }
                        } else {
                          populationColor = "white";
                        }
                        // checking tthat the polygon is selected or not on the basis of popoulation color
                        // populationColor will be white if the polygon is not selected
                        if (populationColor !== "white") {
                          setSelectedPolygonArr((prev) => [...prev, id]);
                        }

                        let poly = {
                          id: pdata._id,
                          coordinates: pdata.boundary.polygon,
                          strokeColor: pdata.boundary.style.fillColor,
                          population,
                          style: {
                            fillColor: populationColor,
                            fillOpacity: 0.4,
                            strokeColor: pdata.boundary.style.fillColor,
                            strokeOpacity: 1,
                            strokeWeight: 1,
                          },
                          // showInfo: true,
                        };
                        tPolygons[indx] = poly;
                        // console.log("poly: ", poly);
                      });
                      setPolygons(tPolygons);
                      // console.log("selectedPolygonArr: ", selectedPolygonArr);
                    }
                  }}
                />
              </div>
            )}
            <div
              style={{
                width: "100vw",
                // height: "60vh",

                // turn ooff scroll
                overflow: "hidden",
              }}
            >
              <MApComp3
                zoom={zoom}
                // markers
                markers={markers}
                // polygons
                polygons={polygons}
                // heatmap
                heatmapData={heatMap}
                buildHeatMap={true}
                multiHeatmaps={multiHeatmaps}
                center={{
                  lat: -1.2500671,
                  lng: 36.6845658999999,
                }}
                updateTime={updateTime}
                handlePolygonClick={(id, index, data) => {
                  // console.log(data);
                  // setting the polygon flag to false
                  setSelectedPolygonId(data?.id);
                  setPolygonModalFalag(true);
                }}
                handleMarkerClick={(id, ind, mark) => {
                  // console.log(id, ind, mark);
                }}
              ></MApComp3>
            </div>
            <div
              className="position-absolute"
              style={{
                zIndex: 20,
                width: "200px",
                top: polygonFlag ? 65 : 20,
                left: 10,
              }}
            >
              <Button
                // className="btn btn-primary btn-small"
                style={{
                  marginBottom: "10px",
                  width: "160px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                }}
                onClick={() => {
                  // setting the show customers flag to true
                  setCustomerFlag(true);
                  if (!polygonFlag) {
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
                          showInfo: true,
                        };
                      }
                    }
                    // console.log("markers: ", markers);
                    setMarkers(markers);
                  } else {
                    // console.log("i need to update the customers: ", customerFlag);
                    let markers = {};
                    for (let pid in customerslist) {
                      if (selectedPolygonArr.includes(pid)) {
                        let custList = customerslist[pid];
                        for (let cust of custList) {
                          let { id, name, lat, lng } = cust;
                          // console.log("cust id: ", id);
                          // console.log("res: ", selectedPolygonArr.includes(id));
                          markers[id] = {
                            data: { id, name },
                            position: {
                              lat: parseFloat(lat),
                              lng: parseFloat(lng),
                            },
                            // icon: conductedAt,
                            showInfo: true,
                          };
                        }
                      }
                    }

                    setMarkers(markers);
                  }
                }}
              >
                Show Customers
              </Button>
              <Button
                // className="btn btn-primary"
                style={{
                  marginBottom: "10px",
                  width: "160px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                }}
                onClick={() => {
                  // setting the show customers flag to false
                  setCustomerFlag(false);
                  setMarkers({});
                }}
              >
                Hide Customers
              </Button>
              <Button
                // className="btn btn-primary"
                style={{
                  marginBottom: "10px",
                  width: "160px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                }}
                onClick={() => {
                  // this flag is only for slider
                  setPolygonFlag(true);
                  setSelectedPolygonArr([]);
                  let tPolygons = {};
                  const ids = Object.keys(polyData.nairobi.locations);
                  // console.log(ids);
                  ids.forEach((id, indx) => {
                    // console.log(polyData.nairobi.locations[id]);
                    const pdata = polyData.nairobi.locations[id];
                    const population = pdata.data.population;
                    // console.log("population: ", population);
                    let populationColor = "white";
                    const scaledArray = [
                      sliderData.min,
                      (sliderData.max - sliderData.min) / 4 + sliderData.min,
                      ((sliderData.max - sliderData.min) / 4) * 2 +
                        sliderData.min,
                      ((sliderData.max - sliderData.min) / 4) * 3 +
                        sliderData.min,
                      sliderData.max,
                    ];

                    if (population < scaledArray[1] && population >= 0) {
                      populationColor = colors[0];
                    } else if (population < scaledArray[2]) {
                      populationColor = colors[1];
                    } else if (population < scaledArray[3]) {
                      populationColor = colors[2];
                    } else if (population < scaledArray[4]) {
                      populationColor = colors[3];
                    } else {
                      populationColor = colors[4];
                    }
                    setSelectedPolygonArr((prev) => [...prev, pdata._id]);
                    let poly = {
                      id: pdata._id,
                      coordinates: pdata.boundary.polygon,
                      strokeColor: pdata.boundary.style.fillColor,
                      population,
                      style: {
                        fillColor: populationColor,
                        fillOpacity: 0.4,
                        strokeColor: pdata.boundary.style.fillColor,
                        strokeOpacity: 1,
                        strokeWeight: 1,
                      },
                      // showInfo: true,
                    };
                    tPolygons[indx] = poly;
                    // console.log("poly: ", poly);
                  });
                  setPolygons(tPolygons);
                }}
              >
                Show Polygon
              </Button>
              <Button
                // className="btn btn-primary"
                style={{
                  marginBottom: "10px",
                  width: "160px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                }}
                onClick={() => {
                  // this flag is only for slider
                  setPolygonFlag(false);
                  setPolygons({});
                }}
              >
                Hide Polygon
              </Button>
              <Button
                // className="btn btn-primary"
                style={{
                  marginBottom: "10px",
                  width: "160px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                }}
                onClick={() => {
                  setMultiHeatmaps(false);
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
                  // console.log(theatmap);
                  setTime(Date.now());
                  setHeatMap(theatmap);
                }}
              >
                Show HeatMap
              </Button>
              <Button
                // className="btn btn-primary"
                style={{
                  marginBottom: "10px",
                  width: "160px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                }}
                onClick={() => {
                  setHeatMap({});
                  setTime(Date.now());
                }}
              >
                Hide HeatMap
              </Button>
              <Button
                // className="btn btn-primary"
                style={{
                  marginBottom: "10px",
                  width: "160px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                }}
                onClick={() => {
                  setMultiHeatmaps(true);
                  const keys = Object.keys(multiheatMapData);
                  let tMulHeatmap = {};
                  keys.forEach((key, indx) => {
                    let point = multiheatMapData[key];
                    // console.log(point);
                    let eachLevelmap = {};
                    point.forEach((p, ind) => {
                      let { coordinates, population } = p;

                      let polygon = {
                        marker: { position: coordinates },
                        data: { weight: population },
                        showInfo: false,
                        multiHeatmap: true,
                        style: {
                          gradient: secToGradient[key]
                            ? secToGradient[key]
                            : secToGradient["AB"],
                        },
                      };
                      eachLevelmap["point" + indx + "-" + ind] = polygon;
                    });
                    tMulHeatmap[key] = eachLevelmap;
                  });
                  setTime(Date.now());
                  setHeatMap(tMulHeatmap);
                  // console.log(tMulHeatmap);
                }}
              >
                Show Multi HeatMap
              </Button>
              <Button
                // className="btn btn-primary"
                style={{
                  marginBottom: "10px",
                  width: "160px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                }}
                onClick={() => {
                  setTime(Date.now());
                  setHeatMap({});
                }}
              >
                Hide Multi HeatMap
              </Button>
            </div>
          </div>
        </div>
      </div>
      {polygonModalFalag && selectedPolygonId?.split("").length >= 1 && (
        <PolygonDetailsModal
          polygonModalFalag={polygonModalFalag}
          setPolygonModalFalag={setPolygonModalFalag}
          selectedPolygonId={selectedPolygonId}
        ></PolygonDetailsModal>
      )}
    </div>
  );
}
