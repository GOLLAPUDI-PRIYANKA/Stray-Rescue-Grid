// frontend/src/services/citizenApi.ts
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || '';

const api = axios.create({
  baseURL: API_BASE || undefined,
  timeout: 10000
});

export async function createTicket(formData: FormData) {
  if (!API_BASE) {
    // No backend configured — keep mock behavior for local UI tests
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ticket_code: `R-MOCK-${Math.floor(Math.random() * 10000)}` };
  }
  const resp = await api.post('/tickets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return resp.data;
}