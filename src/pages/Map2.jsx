import React from "react";
import styled, { CSS } from "styled-components";
export default function Map2() {
  return (
    <div className="container-fluid">
      <div className="row p-2">
        <div>nav bar 1</div>
        <div>Slider div</div>
        <div
          className="col-12 col-sm-6 col- bg-primary d-flex p-2"
          style={{ height: "50vh" }}
        >
          <button className="align-self-center">Hello world</button>
        </div>
        <div
          className="col-12 col-sm-6 bg-info d-flex p-2"
          style={{ height: "50vh" }}
        >
          <button className="align-self-center">Hello world</button>
        </div>
      </div>
    </div>
  );
}
