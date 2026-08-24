import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import MapPicker from '../components/MapPicker';
import useGeolocation from '../hooks/useGeolocation';
import { createTicket } from '../services/api';
import { useNavigate } from 'react-router-dom';
import type { AnimalType } from '../types';

type FormValues = {
  animalType: AnimalType;
  description: string;
  contact?: string;
  photos?: FileList;
};

export default function ReportPage() {
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: { animalType: 'dog', description: '' }
  });
  const [latlng, setLatlng] = useState<{ lat: number; lng: number } | null>(null);
  const { coords, error, request } = useGeolocation();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (coords) setLatlng(coords);
  }, [coords]);

  const onSubmit = async (data: FormValues) => {
    if (!latlng) {
      alert('Please provide a location (use "Use my location" or tap the map).');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('animal_type', data.animalType);
      fd.append('description', data.description);
      fd.append('latitude', String(latlng.lat));
      fd.append('longitude', String(latlng.lng));
      if (data.contact) fd.append('contact', data.contact);
      if (data.photos && data.photos.length > 0) {
        Array.from(data.photos).forEach((f, i) => fd.append('photos', f, f.name));
      }

      // call API
      const res = await createTicket(fd);
      // assume { ticket_code: 'R-1042', id: 123 }
      navigate(`/confirmation/${res.ticket_code ?? res.id ?? 'unknown'}`);
    } catch (err) {
      console.error(err);
      alert('Failed to submit report. If backend is not running, this is expected. See console.');
    } finally {
      setUploading(false);
    }
  };

  // preview photo when selected
  React.useEffect(() => {
    const sub = watch((value) => {
      const files = (value as FormValues).photos;
      if (files && files.length > 0) {
        const f = files[0];
        const reader = new FileReader();
        reader.onload = () => setPreview(String(reader.result));
        reader.readAsDataURL(f);
      } else {
        setPreview(null);
      }
    });
    return () => sub.unsubscribe?.();
  }, [watch]);

  return (
    <div className="space-y-6">
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-medium mb-2">Report an animal</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Animal type</label>
            <select {...register('animalType')} className="mt-1 block w-full border rounded p-2">
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Short description</label>
            <textarea {...register('description')} rows={3} className="mt-1 block w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Photo (optional)</label>
            <input type="file" accept="image/*" {...register('photos')} className="mt-1" />
            {preview && <img src={preview} alt="preview" className="mt-2 h-32 object-cover rounded" />}
          </div>

          <div>
            <label className="block text-sm font-medium">Contact (optional)</label>
            <input type="text" {...register('contact')} placeholder="Phone or email" className="mt-1 block w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={request} className="px-3 py-2 bg-blue-600 text-white rounded">Use my location</button>
              <button type="button" onClick={() => setLatlng(null)} className="px-3 py-2 bg-gray-200 rounded">Clear</button>
            </div>
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
            <div className="mt-3">
              <MapPicker latlng={latlng} setLatlng={setLatlng} />
              {latlng && <div className="text-sm text-gray-600 mt-2">Selected: {latlng.lat.toFixed(6)}, {latlng.lng.toFixed(6)}</div>}
            </div>
          </div>

          <div>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={uploading}>
              {uploading ? 'Submitting...' : 'Submit report'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}