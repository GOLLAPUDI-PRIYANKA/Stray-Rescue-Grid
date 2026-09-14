import { AuthenticationError, getAccessToken } from "./auth";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "");

export async function createCitizenTicket(formData: FormData) {
  const token = getAccessToken();
  if (!token) {
    throw new AuthenticationError("Please sign in before submitting a report.");
  }
  if (!API_BASE) {
    throw new Error("The API base URL is not configured.");
  }

  const response = await fetch(`${API_BASE}/tickets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      animal_type: formData.get("animal_type"),
      description: formData.get("description"),
      severity: "unknown",
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      address_text: null,
    }),
  });

  if (response.status === 401) {
    throw new AuthenticationError("Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    throw new Error("Unable to submit the report. Please try again.");
  }

  const result = (await response.json()) as { ticket_code?: string };
  if (!result.ticket_code) {
    throw new Error("The report response did not include a ticket code.");
  }
  return result;
}
