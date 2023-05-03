import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import MyMapComponent from "./components/MyMapComponent";
import HeatMap from "./components/HeatMap";
import PathWithAutoSearch from "./components/PathWithAutoSearch";
import SimpleMapUsingApi from "./components/SimpleMapUsingApi";
import Map from "./pages/Map";
import {
  AppstoreOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { useState } from "react";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("polygons", "polygons", <AppstoreOutlined />),
  getItem("clusters", "clusters", <AppstoreOutlined />),
  getItem("heatmap", "heatmap", <ContainerOutlined />),
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["polygons"]);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: "AIzaSyBdv1XrGqs_hIPfVFvo2IjnBVVa5jIm6JI",
  // })
  // if (loadError) return "Error loading maps";
  // if (!isLoaded) return "Loading Maps";
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        position: "relative",
      }}
    >
      {/* market example */}
      {/* <MyMapComponent></MyMapComponent> */}
      {/* Heat Map */}
      {/* <HeatMap></HeatMap> */}
      {/* Auto search with path */}
      {/* <PathWithAutoSearch></PathWithAutoSearch> */}
      {/* <SimpleMapUsingApi></SimpleMapUsingApi> */}
      {/* <Map></Map> */}
      {/* <div
        style={{
          width: 256,
          height: "100vh",
          position: "absolute",
          zIndex: 1,
        }}
      >
        <Menu
          defaultSelectedKeys={selectedKeys}
          defaultOpenKeys={selectedKeys}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
          style={{ height: "100vh" }}
          onClick={(e) => {
            // console.log(e);
            setSelectedKeys([e.key]);
            console.log(e.key);
            setCollapsed(!collapsed);
          }}
        />
      </div> */}
      <Map SimpleMapUsingApi selectedKeys={selectedKeys}></Map>
    </div>
  );
}
