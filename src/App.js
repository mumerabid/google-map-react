import React from "react";
import Map from "./pages/Map";

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
      }}
    >
      <div style={{ height: "90vh", overflow: "hidden" }}>
        <Map></Map>
      </div>
    </div>
  );
}
