import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitRoute({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length < 2) {
      return;
    }

    map.fitBounds(positions, {
      padding: [40, 40],
    });
  }, [map, positions]);

  return null;
}

const RouteMap = ({ route = [], geometry = null }) => {
  if (!route.length) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl bg-gray-100">
        <p className="text-gray-500">No route available</p>
      </div>
    );
  }

  const validStops = route.filter(
    (point) =>
      typeof point.latitude === "number" && typeof point.longitude === "number",
  );

  if (!validStops.length) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl bg-gray-100">
        <p className="text-gray-500">Invalid route coordinates</p>
      </div>
    );
  }

  const stopPositions = validStops.map((point) => [
    point.latitude,
    point.longitude,
  ]);

  // OSRM GeoJSON uses [longitude, latitude]
  // Leaflet uses [latitude, longitude]
  const roadPositions =
    geometry?.coordinates?.map(([longitude, latitude]) => [
      latitude,
      longitude,
    ]) || [];

  const polylinePositions =
    roadPositions.length > 1 ? roadPositions : stopPositions;

  const center = stopPositions[0];

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitRoute positions={polylinePositions} />

        <Polyline
          positions={polylinePositions}
          pathOptions={{
            weight: 5,
          }}
        />

        {validStops.map((point, index) => (
          <Marker
            key={`${point.latitude}-${point.longitude}-${index}`}
            position={[point.latitude, point.longitude]}
          >
            <Popup>
              <div>
                <strong>
                  {index === validStops.length - 1
                    ? "Delivery"
                    : `Pickup ${index + 1}`}
                </strong>

                <br />

                {point.location || "Location"}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
