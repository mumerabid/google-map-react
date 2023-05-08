<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Readme.md</title>
  </head>
  <body>
    <p>
      React Google Maps is a web application that utilizes the Google Maps API
      to display various features such as markers, marker clusters, polygons,
      heat maps, and multi-level heat maps.
    </p>

    <h2>Getting Started</h2>

    <ol>
      <li>
        Clone the repository by running
        <code>git clone https://github.com/mumerabid/google-maps-api.git</code>
        in your terminal.
      </li>
      <li>
        Navigate to the project directory by running
        <code>cd google-maps-api</code>.
      </li>
      <li>
        Install the required dependencies by running <code>npm install</code>.
      </li>
      <li>
        Obtain a Google Maps API key from the
        <a href="https://console.cloud.google.com/">Google Cloud Console</a>.
      </li>
      <li>
        Create a <code>.env</code> file in the root directory of the project and
        add the following line:
        <code>REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY</code>, where
        <code>YOUR_API_KEY</code> is your Google Maps API key.
      </li>
      <li>Start the application by running <code>npm start</code>.</li>
    </ol>

    <h2>Libraries Used</h2>

    <p>
      The following libraries were used in the creation of this application:
    </p>

    <ul>
      <li><a href="https://reactjs.org/">React</a></li>
      <li>
        <a href="https://developers.google.com/maps/documentation"
          >Google Maps API</a
        >
      </li>
      <li>
        <a href="https://github.com/google-map-react/google-map-react"
          >google-map-react</a
        >
      </li>
      <li>
        <a href="https://www.npmjs.com/package/@googlemaps/markerclustererplus"
          >@googlemaps/markerclustererplus</a
        >
      </li>
      <li><a href="https://getbootstrap.com/">Bootstrap</a></li>
    </ul>

    <h2>Features</h2>

    <p>The React Google Maps application includes the following features:</p>

    <ul>
      <li>Markers with customized icons and pop-up information on click</li>
      <li>Marker clusters for improved performance</li>
      <li>Polygons with customized colors and pop-up information on click</li>
      <li>Heat maps with gradient colors based on data density</li>
      <li>Multi-level heat maps with multiple layers of data</li>
    </ul>

    <h2>How to Use</h2>

    <p>To use the application, follow the steps below:</p>

    <ol>
      <li>
        Navigate to the desired location on the map by dragging the map or using
        the search bar.
      </li>
      <li>Click on a marker to view its name.</li>
      <li>Click on a polygon to view its associated data.</li>
      <li>
        Toggle the marker cluster display using the button in the top-right
        corner of the map.
      </li>
      <li>
        Toggle the heat map display using the button in the top-right corner of
        the map.
      </li>
      <li>
        Toggle the multi-level heat map layers using the button in the top-right
        corner of the map.
      </li>
    </ol>

    <h2>Contributing</h2>
    <p>
      Contributions to this project are welcome. To contribute, follow the steps
      below:
    </p>
    <ol>
      <li>Fork the repository and create a new branch for your changes.</li>
      <li>Make your changes and ensure they are fully tested.</li>
      <li>
        Create a pull request and include a detailed description of your
        changes.
      </li>
      <li>Wait for feedback and address any requested changes.</li>
      <li>After approval, your changes will be merged into the main branch.</li>
    </ol>
    <h1>Happy Coding!</h1>

  </body>
</html>
