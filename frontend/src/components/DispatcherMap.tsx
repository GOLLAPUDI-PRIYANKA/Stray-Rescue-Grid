import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { Ticket } from "../types/ticket";

interface DispatcherMapProps {
  tickets: Ticket[];
}

const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function DispatcherMap({
  tickets,
}: DispatcherMapProps) {
  const center: [number, number] = [16.5062, 80.648];

  return (
    <div
      style={{
        width: "100%",
        height: "450px",
      }}
    >
      <MapContainer
        center={center}
        zoom={12}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tickets.map((ticket) => (
          <Marker
            key={ticket.id}
            position={[
              ticket.latitude,
              ticket.longitude,
            ]}
            icon={markerIcon}
          >
            <Popup>
              <strong>{ticket.ticket_code}</strong>

              <br />

              Animal: {ticket.animal_type}

              <br />

              Priority: {ticket.priority_level}

              <br />

              Status: {ticket.status}

              <br />

              Address: {ticket.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}