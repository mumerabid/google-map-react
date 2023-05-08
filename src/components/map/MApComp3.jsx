import React, { PureComponent } from "react";
import { renderToString } from "react-dom/server";
import GoogleMapReact from "google-map-react";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import _ from "lodash";

import {
  Card,
  CardTitle,
  //  Table,
  CardText,
} from "reactstrap";
import { GoogleMapThemes } from "../../assets/styles/google-map/google-maps-themes";
import {
  // black8,
  blue8 as poiIcon,
  green8 as districtIcon,
  //  survey
} from "../../assets/images";

// import { constants } from "../../utils";

const THEME_INDEX = 0; //8;
// const DELTA = 0.0008983152841182118;

const getMarkerInfoWindowString = (marker) => {
  let content = (
    <Card>
      {/* <CardTitle size="sm">{marker.data && marker.data.id ? marker.data.id : marker.label ? marker.label : ""}</CardTitle> */}
      <CardTitle size="sm">
        {marker.data && marker.data.name
          ? marker.data.name
          : marker.label
          ? marker.label
          : ""}
      </CardTitle>
      {/* <CardSubtitle>{marker.data && marker.data.name ? marker.data.name : marker.label ? marker.label : ""}</CardSubtitle>
			<CardText>{marker.data && marker.data.address ? marker.data.address : marker.address ? marker.address : ""}</CardText> */}
      {Object.keys(marker.data).length > 0 &&
        Object.keys(marker.data).map((key, ind) => {
          return (
            key !== "name" &&
            key !== "id" &&
            key !== "sec" &&
            key !== "channelType" && (
              <CardText key={ind}>
                {key.toLocaleUpperCase()}:
                <strong style={{ color: "#ff6939", fontSize: 16 }}>
                  {marker.data[key]}
                </strong>
              </CardText>
            )
          );
        })}
    </Card>
  );
  return renderToString(content);
};

const getPolygonInfoWindowString = (polygon) => {
  let content;
  let { data = {} } = polygon;
  let typeTable = (
    <div className="font12 fontW500">
      {data &&
        Object.keys(data).map((key, index) => {
          return (
            <p className="mb-0" key={`${key}_${index}`}>
              <label className="mb-0">
                <b>{_.startCase(key)}:</b>
              </label>
              <strong className="text-success ml-2 h6 mb-0">{data[key]}</strong>
            </p>
          );
        })}
    </div>
  );
  content = <div>{typeTable}</div>;

  return renderToString(content);
};
class GoogleMap extends PureComponent {
  constructor() {
    super();
    this.state = {
      googleMap: null,
      infoWindows: {},
      map: null,
      mapLoaded: false,
      markers: [],
      polygons: [],
      polygonInfoWindows: [],
      polylines: [],
      polylineInfoWindows: [],
      circles: [],
      circleInfoWindows: [],
      heatMap: null,
      heatMapData: null,
      multiHeatmaps: [],
      cluster: null,
    };
    this.actionToOpacity = {
      over: 0.9,
      out: 0.75,
      down: 1.0,
      up: 0.9,
    };
    this.reseting = false;
    this.resetingPolygons = false;
    this.resetingMarkers = false;
    this.resetingCircles = false;
    this.resetingPolylines = false;
    this.resetingHeatmap = false;
    this.googleMapRef = React.createRef();
  }

  getMapOptions = (googleMap) => {
    return {
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: googleMap ? googleMap.ControlPosition.RIGHT_BOTTOM : null,
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: googleMap ? googleMap.MapTypeControlStyle.HORIZONTAL_BAR : null,
        position: googleMap ? googleMap.ControlPosition.BOTTOM_CENTER : null,
      },
      scaleControl: false,
      streetViewControl: false,
      streetViewControlOptions: {
        position: googleMap ? googleMap.ControlPosition.LEFT_TOP : null,
      },
      styles: GoogleMapThemes[THEME_INDEX],
      zoomControl: true,
      zoomControlOptions: {
        position: googleMap ? googleMap.ControlPosition.RIGHT_BOTTOM : null,
      },
    };
  };

  componentDidMount() {
    if (this.state.mapLoaded) {
      this.buildPolygonsFromData(this.props.polygons);
      this.buildMarkersFromData(this.props.markers);
      this.buildPolylinesFromData(this.props.polylines);
      this.buildCirclesFromData(this.props.circles);
      this.getMapBounds({
        markers: this.props.markers,
        polygons: this.props.polygons,
        circles: this.props.circles,
      });
      if (this.props.getRef) this.props.getRef(this.googleMapRef);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.mapLoaded) {
      // added these lines to handle the reseting of the heatmap [reset heatmap]
      // if (
      //   this.props?.heatmapData !== prevProps.heatmapData &&
      //   this.state.heatMap !== null
      // ) {
      //   if (this.state.ismultiHeatmap) {
      //     console.log("multi heatmap reset");
      //     this.state.multiHeatmaps.forEach((heatmap) => {
      //       heatmap.setMap(null);
      //     });
      //   } else {
      //     console.log("single heatmap reset");
      //     this.state.heatMap.setMap(null);
      //   }
      // }
      // till here[reset heatmap]
      if (
        this.props.polygons &&
        (!prevProps.polygons ||
          prevProps.polygons !== this.props.polygons ||
          prevProps.updateTime !== this.props.updateTime)
      ) {
        if (!this.props.buildHeatMap) this.handleNewPolygons();
        else this.handleNewHeatMap();
      } else if (prevProps.updateTime !== this.props.updateTime) {
        if (!this.props.buildHeatMap) this.handleNewPolygons();
        else this.handleNewHeatMap();
      }
      if (
        this.props.markers &&
        (!prevProps.markers || prevProps.markers !== this.props.markers)
      ) {
        this.handleNewMarkers();
      }
      if (
        this.props.polylines &&
        prevProps.polylines !== this.props.polylines
      ) {
        this.handleNewPolylines();
      }
      if (
        this.props.circles &&
        (!prevProps.circles ||
          prevProps.circles !== this.props.circles ||
          prevProps.updateTime !== this.props.updateTime)
      )
        this.handleNewCircles();
    }
  }

  componentWillUnmount() {
    let {
      infoWindows,
      markers,
      polygons,
      polygonInfoWindows,
      circles,
      circleInfoWindows,
      heatMap,
      polylines,
      polylineInfoWindows,
      multiHeatmaps,
      cluster,
    } = this.state;
    for (const info in infoWindows) {
      infoWindows[info].setMap(null);
    }
    for (const marker of markers) {
      marker.setMap(null);
    }
    for (const polygon of polygons) {
      polygon.setMap(null);
    }
    for (const info of polygonInfoWindows) {
      info.setMap(null);
    }
    for (const polyline of polylines) {
      polyline.setMap(null);
    }
    for (const info of polylineInfoWindows) {
      info.setMap(null);
    }
    for (const circle of circles) {
      circle.setMap(null);
    }
    for (const info of circleInfoWindows) {
      info.setMap(null);
    }
    if (heatMap) heatMap.setMap(null);
    for (const heatmap of multiHeatmaps) {
      heatmap.setMap(null);
    }
    if (cluster) {
      cluster.clearMarkers();
      cluster.setMap(null);
    }
    this.setState({
      infoWindows: {},
      markers: [],
      polygons: [],
      polygonInfoWindows: [],
      circles: [],
      circleInfoWindows: [],
      heatMap: null,
      polylines: [],
      polylineInfoWindows: [],
      heatMapData: null,
      multiHeatmaps: [],
      cluster: null,
    });
  }

  handleApiLoaded = (map, maps) => {
    if (!this.reseting) {
      this.reset();
      if (map) {
        if (!this.state.mapLoaded) {
          if (this.props.getRef) this.props.getRef(this.googleMapRef);
          if (this.props.getGoogleMap) this.props.getGoogleMap(maps);
          map.setOptions(this.getMapOptions(maps));
          this.setState(
            {
              googleMap: maps,
              infoWindows: {},
              map,
              mapLoaded: true,
              markers: [],
              polygons: [],
              polygonInfoWindows: [],
              polylines: [],
              polylineInfoWindows: [],
              circles: [],
              circleInfoWindows: [],
              multiHeatmaps: [],
            },
            () => {
              let { markers, polygons, circles, polylines } = this.props;
              if (!_.isEmpty(polygons)) this.buildPolygonsFromData(polygons);
              if (!_.isEmpty(markers)) this.buildMarkersFromData(markers);
              if (!_.isEmpty(circles)) this.buildCirclesFromData(circles);
              if (!_.isEmpty(polylines)) this.buildPolylinesFromData(polylines);
              this.getMapBounds({ markers, polygons, circles });
              this.reseting = false;
            }
          );
        } else {
          this.setState(
            {
              infoWindows: {},
              markers: [],
              polygons: [],
              polygonInfoWindows: [],
              polylines: [],
              polylineInfoWindows: [],
              circles: [],
              circleInfoWindows: [],
              heatMap: null,
              multiHeatmaps: [],
            },
            () => {
              let { markers, polygons, circles, polylines } = this.props;
              if (!_.isEmpty(polygons)) this.buildPolygonsFromData(polygons);
              if (!_.isEmpty(markers)) this.buildMarkersFromData(markers);
              if (!_.isEmpty(circles)) this.buildCirclesFromData(circles);
              if (!_.isEmpty(polylines)) this.buildPolylinesFromData(polylines);
              // this.getMapBounds({ markers, polygons });
              this.reseting = false;
            }
          );
        }
      }
    }
  };

  handleNewPolygons = () => {
    if (this.state.mapLoaded) {
      if (!this.resetingPolygons) {
        this.resetingPolygons = true;
        let { polygons, polygonInfoWindows, heatMap, multiHeatmaps } =
          this.state;
        for (const polygon of polygons) {
          polygon.setMap(null);
        }
        for (const info of polygonInfoWindows) {
          info.setMap(null);
        }
        if (heatMap) heatMap.setMap(null);
        for (const heatmap of multiHeatmaps) {
          heatmap.setMap(null);
        }
        this.setState(
          {
            polygons: [],
            polygonInfoWindows: [],
            heatMap: null,
            multiHeatmaps: [],
          },
          () => {
            let { polygons } = this.props;
            if (!_.isEmpty(polygons)) {
              this.buildPolygonsFromData(polygons);
              // this.getMapBounds({ polygons });
            }
            this.resetingPolygons = false;
          }
        );
      }
    }
  };

  handleNewMarkers = () => {
    if (this.state.mapLoaded) {
      if (!this.resetingMarkers) {
        this.resetingMarkers = true;
        let { infoWindows, markers, cluster } = this.state;
        for (const marker of markers) {
          marker.setMap(null);
        }
        for (const info in infoWindows) {
          infoWindows[info].setMap(null);
        }
        if (cluster) {
          cluster.clearMarkers();
          cluster.setMap(null);
        }

        this.setState({ infoWindows: {}, markers: [], cluster: null }, () => {
          let { markers } = this.props;
          if (!_.isEmpty(markers)) this.buildMarkersFromData(markers);
          if (this.props.isModalMap) this.getMapBounds({ markers });
          this.resetingMarkers = false;
        });
      }
    }
  };

  handleNewPolylines = () => {
    if (this.state.mapLoaded) {
      if (!this.resetingPolylines) {
        this.resetingPolylines = true;
        let { polylines, polylineInfoWindows } = this.state;
        for (const polyline of polylines) {
          polyline.setMap(null);
        }
        for (const info of polylineInfoWindows) {
          info.setMap(null);
        }
        this.setState({ polylines: [], polylineInfoWindows: [] }, () => {
          let { polylines } = this.props;
          if (!_.isEmpty(polylines)) this.buildPolylinesFromData(polylines);
          // this.getMapBounds({ polygons });
          this.resetingPolylines = false;
        });
      }
    }
  };

  handleNewCircles = () => {
    if (this.state.mapLoaded) {
      if (!this.resetingCircles) {
        this.resetingCircles = true;
        let { circleInfoWindows, circles } = this.state;
        for (const circle of circles) {
          circle.setMap(null);
        }
        for (const info of circleInfoWindows) {
          info.setMap(null);
        }
        this.setState({ circleInfoWindows: [], circles: [] }, () => {
          let { circles } = this.props;
          if (!_.isEmpty(circles)) this.buildCirclesFromData(circles);
          // if (this.props.isModalMap) this.getMapBounds({ circles });
          this.resetingCircles = false;
        });
      }
    }
  };

  handleNewHeatMap = () => {
    if (this.state.mapLoaded) {
      if (!this.resetingHeatmap) {
        // console.log(">>>>>>>>>>>>>>>");
        this.resetingHeatmap = true;
        let { polygons, heatMap, polygonInfoWindows, multiHeatmaps } =
          this.state;
        if (heatMap) heatMap.setMap(null);
        for (const polygon of polygons) {
          polygon.setMap(null);
        }
        for (const info of polygonInfoWindows) {
          info.setMap(null);
        }
        for (const heatmap of multiHeatmaps) {
          heatmap.setMap(null);
        }
        this.setState(
          {
            heatMap: null,
            polygons: [],
            polygonInfoWindows: [],
            multiHeatmaps: [],
          },
          () => {
            let { polygons, heatmapData } = this.props;
            if (!_.isEmpty(polygons)) {
              this.buildPolygonsFromData(polygons);
            }
            if (!_.isEmpty(heatmapData)) {
              this.buildHeatmapFromData(heatmapData);
            }
            if (this.props.isModalMap) this.getMapBounds({ polygons });
            this.resetingHeatmap = false;
          }
        );
      }
    }
  };

  reset = () => {
    this.reseting = true;
    let {
      infoWindows,
      markers,
      polygons,
      polygonInfoWindows,
      circles,
      circleInfoWindows,
      heatMap,
      polylines,
      polylineInfoWindows,
      multiHeatmaps,
      cluster,
    } = this.state;
    for (const info in infoWindows) {
      infoWindows[info].setMap(null);
    }
    for (const marker of markers) {
      marker.setMap(null);
    }
    for (const info of polygonInfoWindows) {
      info.setMap(null);
    }
    for (const polygon of polygons) {
      polygon.setMap(null);
    }
    for (const info of polygonInfoWindows) {
      info.setMap(null);
    }
    for (const polyline of polylines) {
      polyline.setMap(null);
    }
    for (const info of polylineInfoWindows) {
      info.setMap(null);
    }
    for (const circle of circles) {
      circle.setMap(null);
    }
    for (const info of circleInfoWindows) {
      info.setMap(null);
    }
    if (heatMap) heatMap.setMap(null);
    for (const heatmap of multiHeatmaps) {
      heatmap.setMap(null);
    }
    if (cluster) {
      cluster.clearMarkers();
      cluster.setMap(null);
    }
  };

  // Return map bounds based on list of places
  getMapBounds = (data) => {
    const { googleMap, map } = this.state;
    const zoom = map.zoom;
    const bounds = new googleMap.LatLngBounds();
    let allEmpty = true;
    if (this.props.center) {
      bounds.extend(this.props.center);
    }
    for (const key in data) {
      if (!_.isEmpty(data[key])) {
        if (allEmpty) allEmpty = false;
        let ids = Object.keys(data[key]);
        for (const id of ids) {
          let item = data[key][id];
          if (!_.isEmpty(item.coordinates)) {
            for (const coordinate of item.coordinates) {
              bounds.extend(
                new googleMap.LatLng(coordinate.lat, coordinate.lng)
              );
            }
          } else if (!_.isEmpty(item.position)) {
            bounds.extend(
              new googleMap.LatLng(item.position.lat, item.position.lng)
            );
          } else if (!_.isEmpty(item.center)) {
            bounds.extend(
              new googleMap.LatLng(item.center.lat, item.center.lng)
            );
          }
        }
      }
    }
    if (allEmpty) {
      map.setZoom(zoom);
      bounds.extend(map.center);
    }
    map.fitBounds(bounds);
  };

  // ONLY CALL IF this.mapLoaded is true
  buildPolygonsFromData = (data) => {
    // console.log(data);
    try {
      // if (this.props.showSec) {
      // 	data = null;
      // 	data = this.props.secPolygons;
      // }
      // if (this.props.showTAM) {
      // 	data = null;
      // 	data = this.props.TamPolygons;
      // }
      if (this.props.flagTamSec) {
        data = null;
        data = this.props.TamSecPolygons;
      }
      let { googleMap, map } = this.state;
      let polygons = [];
      let polygonInfoWindows = [];
      let ids = Object.keys(data);
      for (const [ind, id] of ids.entries()) {
        let polygon = data[id];
        // console.log("polygon", polygon);
        if (polygon.coordinates) {
          let poly = new googleMap.Polygon({
            paths: polygon.coordinates,
            strokeColor:
              polygon.style && polygon.style.strokeColor
                ? polygon.style.strokeColor
                : polygon.strokeColor
                ? polygon.strokeColor
                : "#000",
            strokeOpacity: 1.0,
            strokeWeight:
              polygon.style && polygon.style.strokeWeight
                ? polygon.style.strokeWeight
                : polygon.strokeWeight
                ? polygon.strokeWeight
                : 1,
            fillColor:
              polygon.style && polygon.style.fillColor
                ? polygon.style.fillColor
                : polygon.fillColor
                ? polygon.fillColor
                : "#ffffff",
            fillOpacity: this.actionToOpacity["out"],
            zIndex:
              polygon.style && polygon.style.zIndex
                ? polygon.style.zIndex
                : polygon.zIndex
                ? polygon.zIndex
                : 10,
          });
          // if (polygon.showInfo) {
          // 	let infoWindow = new googleMap.InfoWindow({
          // 		content: getPolygonInfoWindowString(polygon),
          // 	});
          // 	poly.addListener("click", () => this.handlePolygonClick(id, ind));
          // 	poly.addListener("mouseover", () => this.handlePolygonMouseAction(id, ind, "over", infoWindow));
          // 	poly.addListener("mouseout", () => this.handlePolygonMouseAction(id, ind, "out", infoWindow));
          // 	poly.addListener("mouseup", () => this.handlePolygonMouseAction(id, ind, "up"));
          // 	poly.addListener("mousedown", () => this.handlePolygonMouseAction(id, ind, "down"));
          // 	polygonInfoWindows.push(infoWindow);
          // } else {
          poly.addListener("click", () =>
            this.handlePolygonClick(id, ind, polygon)
          );
          if (polygon.polygonTooltipOn) {
            let infoWindow = new googleMap.InfoWindow({
              content: getPolygonInfoWindowString(polygon),
            });
            poly.addListener("mouseover", () =>
              this.handlePolygonMouseAction(
                id,
                ind,
                "over",
                polygon,
                infoWindow
              )
            );
            poly.addListener("mouseout", () =>
              this.handlePolygonMouseAction(id, ind, "out", polygon, infoWindow)
            );
            poly.addListener("mouseup", () =>
              this.handlePolygonMouseAction(id, ind, "up", polygon, infoWindow)
            );
            poly.addListener("mousedown", () =>
              this.handlePolygonMouseAction(
                id,
                ind,
                "down",
                polygon,
                infoWindow
              )
            );
          }
          // }
          poly.setMap(map);
          polygons.push(poly);
          map.setZoom(9);
        }
      }
      if (!this.props.buildHeatMap) map.setOptions({ zoomControl: true });
      // map.setOptions({ maxZoom: 17 });
      this.setState({ polygons, polygonInfoWindows });
    } catch (err) {
      console.error(err);
    }
  };

  buildMarkersFromData = (data) => {
    try {
      let { googleMap, map } = this.state;
      let markers = [];
      let ids = Object.keys(data);
      for (const [ind, id] of ids.entries()) {
        let mark = data[id];
        let marker = new googleMap.Marker({
          position: { lat: mark.position.lat, lng: mark.position.lng },
          icon: mark.icon ? mark.icon : mark.isPoi ? poiIcon : districtIcon,
          label: mark.data.title ? mark.data.title : "",
        });

        if (mark.showInfo) {
          marker.addListener("click", () =>
            this.handleMarkerClick(id, ind, mark)
          );
          // marker.addListener("mouseover", () => this.handleMarkerMouseAction(id, ind, "over", infoWindow));
          // marker.addListener("mouseout", () => this.handleMarkerMouseAction(id, ind, "out", infoWindow));
          // marker.addListener("mouseup", () => this.handleMarkerMouseAction(id, ind, "up", infoWindow));
          // marker.addListener("mousedown", () => this.handleMarkerMouseAction(id, ind, "down", infoWindow));
          // 	marker.setMap(map);
        } else {
          // marker.addListener("click", () => this.handleMarkerClick(id, ind));
          // marker.addListener("mouseover", () => this.handleMarkerMouseAction(id, ind, "over"));
          // marker.addListener("mouseout", () => this.handleMarkerMouseAction(id, ind, "out"));
          // marker.addListener("mouseup", () => this.handleMarkerMouseAction(id, ind, "up"));
          // marker.addListener("mousedown", () => this.handleMarkerMouseAction(id, ind, "down"));
          // 	marker.setMap(map);
        }

        markers.push(marker);
      }

      let cluster = new MarkerClusterer(map, markers, {
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        maxZoom: 14,
        minimumClusterSize: 5,
      });
      this.setState({ markers, cluster });
      map.setZoom(9);
      // this.setState({ markers });
    } catch (err) {
      console.error(err);
    }
  };

  buildPolylinesFromData = (data) => {
    try {
      let { googleMap, map } = this.state;
      let polylines = [];
      let polylineInfoWindows = [];
      let ids = Object.keys(data);
      for (const id of ids) {
        let polyline = data[id];
        // console.log("poly line");
        let poly = new googleMap.Polyline({
          path: polyline.path,
          strokeColor:
            polyline.style && polyline.style.strokeColor
              ? polyline.style.strokeColor
              : polyline.strokeColor
              ? polyline.strokeColor
              : "#000",
          strokeOpacity: 1.0,
          strokeWeight:
            polyline.style && polyline.style.strokeWeight
              ? polyline.style.strokeWeight
              : polyline.strokeWeight
              ? polyline.strokeWeight
              : 1,
          zIndex:
            polyline.style && polyline.style.zIndex
              ? polyline.style.zIndex
              : polyline.zIndex
              ? polyline.zIndex
              : 10,
        });

        poly.setMap(map);
        polylines.push(poly);
      }
      this.setState({ polylines, polylineInfoWindows });
    } catch (err) {
      console.error(err);
    }
  };

  // ONLY CALL IF this.mapLoaded is true
  buildCirclesFromData = (data) => {
    try {
      let { googleMap, map } = this.state;
      let circles = [];
      let circleInfoWindows = [];
      let ids = Object.keys(data);
      for (const [ind, id] of ids.entries()) {
        let circle = data[id];
        let cir = new googleMap.Circle({
          center: circle.center,
          radius: circle.radius,
          strokeColor:
            circle.style && circle.style.strokeColor
              ? circle.style.strokeColor
              : circle.strokeColor
              ? circle.strokeColor
              : "#000",
          strokeOpacity: 1.0,
          strokeWeight:
            circle.style && circle.style.strokeWeight
              ? circle.style.strokeWeight
              : circle.strokeWeight
              ? circle.strokeWeight
              : 1,
          fillColor:
            circle.style && circle.style.fillColor
              ? circle.style.fillColor
              : circle.fillColor
              ? circle.fillColor
              : "#ffffff",
          fillOpacity: this.actionToOpacity["out"],
          zIndex:
            circle.style && circle.style.zIndex
              ? circle.style.zIndex
              : circle.zIndex
              ? circle.zIndex
              : 10,
        });
        if (circle.showInfo) {
          let infoWindow = new googleMap.InfoWindow({
            content: getPolygonInfoWindowString(circle),
          });
          cir.addListener("click", () => this.handleCircleClick(id, ind));
          cir.addListener("mouseover", () =>
            this.handleCircleMouseAction(id, ind, "over", infoWindow)
          );
          cir.addListener("mouseout", () =>
            this.handleCircleMouseAction(id, ind, "out", infoWindow)
          );
          cir.addListener("mouseup", () =>
            this.handleCircleMouseAction(id, ind, "up")
          );
          cir.addListener("mousedown", () =>
            this.handleCircleMouseAction(id, ind, "down")
          );
          circleInfoWindows.push(infoWindow);
        } else {
          cir.addListener("click", () => this.handleCircleClick(id, ind));
          cir.addListener("mouseover", () =>
            this.handleCircleMouseAction(id, ind, "over")
          );
          cir.addListener("mouseout", () =>
            this.handleCircleMouseAction(id, ind, "out")
          );
          cir.addListener("mouseup", () =>
            this.handleCircleMouseAction(id, ind, "up")
          );
          cir.addListener("mousedown", () =>
            this.handleCircleMouseAction(id, ind, "down")
          );
        }
        cir.setMap(map);
        circles.push(cir);
      }
      this.setState({ circles, circleInfoWindows });
    } catch (err) {
      console.error(err);
    }
  };

  buildHeatmapFromData = (data) => {
    try {
      // console.log(data);
      let { googleMap, map, infoWindow } = this.state;
      if (infoWindow) infoWindow.close(map, null);
      if (this.props.multiHeatmaps) return this.buildMultiHeatmapFromData(data);
      let heatMapData = [];
      let gradient = null;
      const ids = Object.keys(data);
      for (const id of ids) {
        let polygon = data[id];
        if (!gradient) {
          if (polygon?.style?.gradient) gradient = polygon?.style?.gradient;
        }
        let coordinate = polygon.marker.position;
        let latLng = new googleMap.LatLng(coordinate.lat, coordinate.lng);
        // let weight = Math.pow(polygon.data.weight, 2);
        // let weight = Math.sqrt(polygon.data.weight);
        let weight = polygon.data.weight;
        heatMapData.push({
          location: latLng,
          weight: weight,
        });
      }
      let heatMap = new googleMap.visualization.HeatmapLayer({
        data: heatMapData,
      });

      // let gradient = [...constants.heatmapGradientRgb].reverse();
      // gradient = ["rgba(255, 0, 0, 0)", ...gradient];
      //   heatMap.set("gradient", gradient);

      map.setOptions({ zoomControl: false });
      map.setZoom(9);
      // heatMap.set("radius", 5);
      heatMap.setMap(map);
      this.setState({ heatMap });
    } catch (err) {
      console.error(err);
    }
  };

  buildMultiHeatmapFromData = (data) => {
    try {
      let { googleMap, map, infoWindow } = this.state;
      if (infoWindow) infoWindow.close(map, null);
      let multiHeatmaps = [];
      for (const level in data) {
        // console.log(level);
        let heatMapData = [];
        let gradient = null;
        let levelData = data[level];
        const ids = Object.keys(levelData);
        for (const id of ids) {
          let polygon = levelData[id];
          if (polygon.multiHeatmap) {
            if (!gradient)
              if (polygon?.style?.gradient) gradient = polygon?.style?.gradient;
            let coordinate = polygon.marker.position;
            let latLng = new googleMap.LatLng(coordinate.lat, coordinate.lng);
            // let weight = Math.sqrt(polygon.data.weight);
            let weight = polygon.data.weight;
            heatMapData.push({
              location: latLng,
              weight: weight,
            });
          }
        }
        let heatMap = new googleMap.visualization.HeatmapLayer({
          data: heatMapData,
        });
        heatMap.set("gradient", gradient);
        map.setOptions({ zoomControl: false });
        map.setZoom(9);

        // heatMap.set("radius", 3);
        heatMap.setMap(map);
        multiHeatmaps.push(heatMap);
      }
      // console.log(multiHeatmaps);
      this.setState({ multiHeatmaps });
    } catch (err) {
      console.error(err);
    }
  };

  handlePolygonClick = (id, index, data) => {
    try {
      if (this.props.handlePolygonClick)
        this.props.handlePolygonClick(id, index, data);
    } catch (err) {
      console.error(err);
    }
  };

  handlePolygonMouseAction = (id, index, action, data, infoWindow, event) => {
    try {
      let { polygons, googleMap, map } = this.state;
      if (polygons[index]) {
        polygons[index].setOptions({
          fillOpacity: this.actionToOpacity[action],
        });
        if (this.props.handlePolygonMouseAction)
          this.props.handlePolygonMouseAction(id, index, action);

        if (this.props.polygonToolTipOn) {
          if (action === "over") {
            let bounds = new googleMap.LatLngBounds();
            for (var i = 0; i < polygons[index].getPath().getLength(); i++) {
              bounds.extend(polygons[index].getPath().getAt(i));
            }
            // infoWindow.open(map, polygons[index]);
            infoWindow.setPosition(bounds.getCenter());
            infoWindow.open(map);
          } else if (action === "out") infoWindow.close(map, null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // handlePolygonMouseAction = (id, index, action, infoWindow, event) => {
  // 	try {
  // 		let { polygons, googleMap, map } = this.state;
  // 		if (polygons[index]) {
  // 			polygons[index].setOptions({
  // 				fillOpacity: this.actionToOpacity[action],
  // 			});
  // 			if (this.props.handlePolygonMouseAction) this.props.handlePolygonMouseAction(id, index, action);

  // 			if (this.props.polygonToolTipOn && infoWindow) {
  // 				if (action === "over") {
  // 					let bounds = new googleMap.LatLngBounds();
  // 					for (var i = 0; i < polygons[index].getPath().getLength(); i++) {
  // 						bounds.extend(polygons[index].getPath().getAt(i));
  // 					}
  // 					// infoWindow.open(map, polygons[index]);
  // 					infoWindow.setPosition(bounds.getCenter());
  // 					infoWindow.open(map);
  // 				} else if (action === "out") infoWindow.close(map, null);
  // 			}
  // 		}
  // 	} catch (err) {
  // 		console.error(err);
  // 	}
  // };

  handleMarkerClick = (id, index, mark) => {
    try {
      let { map, googleMap, infoWindows, markers } = this.state;
      // for (const info in infoWindows) {
      // 	infoWindows[info].close(map, null);
      // }
      if (infoWindows[id]) {
        infoWindows[id].close(map, null);
      }
      let infoWindow = new googleMap.InfoWindow({
        content: getMarkerInfoWindowString(mark),
      });
      infoWindow.open(map, markers[index]);
      if (this.props.handleMarkerClick)
        this.props.handleMarkerClick(id, index, markers[index], infoWindow);
      infoWindows[id] = infoWindow;
      this.setState({ infoWindows });
    } catch (err) {
      console.error(err);
    }
  };

  handleMarkerMouseAction = (id, index, action, infoWindow) => {
    // handleMarkerMouseAction = (id, index, action) => {
    try {
      // let { map, markers } = this.state;
      // if (infoWindow) {
      // 	if (action === "over") infoWindow.open(map, markers[index]);
      // 	else if (action === "out") infoWindow.close(map, markers[index]);
      // 	if (this.props.handleMarkerMouseAction) this.props.handleMarkerMouseAction(id, index, action, markers[index], infoWindow);
      // } else {
      // 	if (this.props.handleMarkerMouseAction) this.props.handleMarkerMouseAction(id, index, action, markers[index]);
      // }
    } catch (err) {
      console.error(err);
    }
  };

  handleCircleClick = (id, index) => {
    try {
      if (this.props.handleCircleClick) this.props.handleCircleClick(id, index);
    } catch (err) {
      console.error(err);
    }
  };

  handleCircleMouseAction = (id, index, action, infoWindow, event) => {
    try {
      let { circles, googleMap, map } = this.state;
      if (circles[index]) {
        circles[index].setOptions({
          fillOpacity: this.actionToOpacity[action],
        });
        if (this.props.handleCircleMouseAction)
          this.props.handleCircleMouseAction(id, index, action);

        if (this.props.circleToolTipOn && infoWindow) {
          if (action === "over") {
            let bounds = new googleMap.LatLngBounds();
            // for (var i = 0; i < circles[index].getPath().getLength(); i++) {
            bounds.extend(circles[index].getCenter());
            // }
            // infoWindow.open(map, polygons[index]);
            infoWindow.setPosition(bounds.getCenter());
            infoWindow.open(map);
          } else if (action === "out") infoWindow.close(map, null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  handleZoomChanged = (zoom) => {
    if (this.props.onHandleZoom) this.props.onHandleZoom(zoom);
  };

  render() {
    const screenRatio = 1.7778;
    const heightFactor = this.props.heightFactor
      ? this.props.heightFactor
      : 0.7; //0.59;
    const mapHeight = Math.floor(
      (window.innerWidth / screenRatio) * heightFactor
    );
    return (
      // Important! Always set the container height explicitly
      <div className="mapHeight" style={{ height: mapHeight }}>
        <GoogleMapReact
          ref={this.googleMapRef}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            libraries: ["visualization"],
          }}
          defaultCenter={
            this.props.center
              ? this.props.center
              : { lat: 25.20011399986849, lng: 67.57073300016597 }
          }
          defaultZoom={8}
          onChange={(zoom) => this.handleZoomChanged(zoom)}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
        >
          {this.props.customObjectsForMap &&
            this.props.customObjectsForMap.length > 0 && [
              ...this.props.customObjectsForMap,
            ]}
        </GoogleMapReact>
      </div>
    );
  }
}

export default GoogleMap;
