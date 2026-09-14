import { useState } from "react";
import type { ReportLocation } from "../types/report";

export default function useGeolocation() {
  const [coords, setCoords] = useState<ReportLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = () => {
    setError(null);

    if (!navigator.geolocation) {
      setError("Location services are not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: position }) =>
        setCoords({ lat: position.latitude, lng: position.longitude }),
      ({ message }) => setError(message || "Unable to retrieve your location."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return { coords, error, request, setCoords };
}
