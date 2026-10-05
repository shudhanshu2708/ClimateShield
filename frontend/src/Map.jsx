import { MapContainer, TileLayer } from "react-leaflet";

function Map() {
  return (
    <div className="map-container">
      <MapContainer
        center={[26.4499, 80.3319]}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  );
}

export default Map;