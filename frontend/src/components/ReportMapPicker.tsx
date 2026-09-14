import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { ReportLocation } from "../types/report";

interface ReportMapPickerProps {
  location: ReportLocation | null;
  onChange: (location: ReportLocation) => void;
}

function LocationClickHandler({
  onChange,
}: Pick<ReportMapPickerProps, "onChange">) {
  useMapEvents({
    click(event) {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

export default function ReportMapPicker({
  location,
  onChange,
}: ReportMapPickerProps) {
  const center: LatLngExpression = location
    ? [location.lat, location.lng]
    : [16.5062, 80.648];

  return (
    <div className="report-map">
      <MapContainer center={center} zoom={location ? 15 : 12} scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationClickHandler onChange={onChange} />
        {location && <Marker position={[location.lat, location.lng]} />}
      </MapContainer>
    </div>
  );
}
