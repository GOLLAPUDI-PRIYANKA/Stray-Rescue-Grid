import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

// Fix default icon issues with Leaflet + Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

type Props = {
  latlng: { lat: number; lng: number } | null;
  setLatlng: (l: { lat: number; lng: number } | null) => void;
};

function MarkerDraggable({ setLatlng, position }: { position: LatLngExpression; setLatlng: Props['setLatlng'] }) {
  useMapEvents({
    click(e) {
      setLatlng({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

export default function MapPicker({ latlng, setLatlng }: Props) {
  const center: LatLngExpression = latlng ? [latlng.lat, latlng.lng] : [20.5937, 78.9629]; // default to India center (adjust to your city)
  return (
    <div className="h-64 w-full rounded overflow-hidden border">
      <MapContainer center={center} zoom={latlng ? 15 : 5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center as LatLngExpression} />
        <MarkerDraggable position={center} setLatlng={setLatlng} />
      </MapContainer>
    </div>
  );
}