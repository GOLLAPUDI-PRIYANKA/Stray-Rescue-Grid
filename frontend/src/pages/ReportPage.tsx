import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReportMapPicker from "../components/ReportMapPicker";
import useGeolocation from "../hooks/useGeolocation";
import { createCitizenTicket } from "../services/tickets";
import type { AnimalType, ReportLocation } from "../types/report";

export default function ReportPage() {
  const navigate = useNavigate();
  const [animalType, setAnimalType] = useState<AnimalType>("dog");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState<ReportLocation | null>(null);
  const [locationError, setLocationError] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { coords, error: geolocationError, request } = useGeolocation();

  useEffect(() => {
    if (coords) setLocation(coords);
  }, [coords]);

  const useMyLocation = () => {
    setLocationError("");
    request();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!location) {
      setLocationError("Add a location before submitting the report.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    formData.set("animal_type", animalType);
    formData.set("latitude", String(location.lat));
    formData.set("longitude", String(location.lng));

    void createCitizenTicket(formData).then(({ ticket_code }) => {
      navigate(`/report/confirmation/${ticket_code}`);
    }).finally(() => setSubmitting(false));
  };

  return (
    <section className="report-page">
      <div className="report-intro">
        <span className="report-eyebrow">CITIZEN REPORTING</span>
        <h1>Help us find an animal that needs rescue.</h1>
        <p>
          Share a few details and the rescue team will review the report and
          coordinate the right response.
        </p>
        <Link to="/" className="report-back-link">
          ← Back to home
        </Link>
      </div>

      <form className="report-card report-form" onSubmit={onSubmit}>
        <div className="report-form-heading">
          <div>
            <span className="report-eyebrow">NEW REPORT</span>
            <h2>Tell us what you saw</h2>
          </div>
          <span className="required-note">* Required</span>
        </div>

        <label>
          Animal type <span>*</span>
          <select
            name="animal_type"
            value={animalType}
            onChange={(event) => setAnimalType(event.target.value as AnimalType)}
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          What needs attention? <span>*</span>
          <textarea
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the animal and anything the rescue team should know"
            rows={5}
            required
          />
        </label>

        <label>
          Photo <small>(optional)</small>
          <input
            name="photos"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setPhotoName(event.target.files?.[0]?.name ?? "")
            }
          />
          {photoName && <small className="selected-file">{photoName}</small>}
        </label>

        <div className="location-field">
          <div className="field-label">
            <span>
              Location <span>*</span>
            </span>
            {location && (
              <small>
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </small>
            )}
          </div>
          <div className="location-actions">
            <button type="button" className="secondary-action" onClick={useMyLocation}>
              Use my location
            </button>
            {location && (
              <button
                type="button"
                className="clear-location"
                onClick={() => setLocation(null)}
              >
                Clear
              </button>
            )}
          </div>
          <ReportMapPicker location={location} onChange={setLocation} />
          <div className={`location-preview ${location ? "location-selected" : ""}`}>
            <span className="location-pin">●</span>
            {location ? "Location selected." : "Click the map or use your location."}
          </div>
          {(locationError || geolocationError) && (
            <p className="form-error">{locationError || geolocationError}</p>
          )}
        </div>

        <label>
          Contact details <small>(optional)</small>
          <input
            name="contact"
            type="text"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Phone number or email"
          />
        </label>

        <button
          type="submit"
          className="primary-action report-submit"
          disabled={submitting}
        >
          {submitting ? "Sending report..." : "Submit report"}
          <span>→</span>
        </button>
      </form>
    </section>
  );
}
